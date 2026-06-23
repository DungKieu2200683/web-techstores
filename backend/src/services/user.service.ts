import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { RegisterInput } from "../validators/user.validator";
import { AppError } from "../utils/AppError";
import { UserResponse, LoginDTO } from "../types/user.type";
import { generateToken } from "../utils/jwt.util";

/**
 * @description Tầng Service chuyên xử lý logic nghiệp vụ cho User
 */
class UserService {
  /**
   * @description Hàm xử lý nghiệp vụ đăng ký tài khoản (Auto-login sau khi đăng ký)
   * @param {RegisterInput} payload - Dữ liệu thô từ Controller truyền xuống
   * @returns {Promise<{ user: UserResponse, token: string }>} - Trả về cả Token để đăng nhập luôn
   */
  async registerUser(payload: RegisterInput): Promise<{ user: UserResponse, token: string }> {
    const { email, password, fullName } = payload;

    // 1. Kiểm tra email
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(400, "Email này đã được sử dụng!");
    }

    // 2. Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo User trong Database thông qua DTO
    const newUser = await userRepository.createUser({
      email,
      password: hashedPassword,
      fullName,
    });

    // 4. Bóc tách password ra khỏi object (Bảo mật)
    const { password: _, ...userWithoutPassword } = newUser;

    // 5. Tạo Token để tự động Đăng nhập
    const token = generateToken(newUser.id, newUser.role);

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * @description Hàm xử lý nghiệp vụ đăng nhập
   * @param {LoginDTO} payload - Email và Password từ client
   * @returns {Promise<{ user: UserResponse, token: string }>}
   */
  async loginUser(
    payload: LoginDTO,
  ): Promise<{ user: UserResponse; token: string }> {
    const { email, password } = payload;

    // 1. Tìm User bằng email
    const user = await userRepository.findByEmail(email);

    // Nếu không tìm thấy user, quăng lỗi 401 Unauthorized
    if (!user) {
      throw new AppError(401, "Email hoặc mật khẩu không chính xác");
    }

    // Nếu tài khoản bị vô hiệu hóa
    if (!user.isActive) {
      throw new AppError(
        403,
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ CSKH.",
      );
    }

    // 2. So sánh mật khẩu
    // user.password có thể undefined theo interface, nhưng DB bắt buộc có, ép kiểu an toàn
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordCorrect) {
      throw new AppError(401, "Email hoặc mật khẩu không chính xác");
    }

    // 3. Tạo JWT Token
    const token = generateToken(user.id, user.role);

    // 4. Bóc tách password trước khi trả về
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}

export const userService = new UserService();
