import { PrismaClient } from '@prisma/client';
import { UserDTO, CreateUserDTO } from '../types/user.type';

// Khởi tạo Prisma Client để giao tiếp với Database
const prisma = new PrismaClient();

/**
 * @description Tầng Repository chuyên xử lý truy vấn Database cho thực thể User
 * @business Chỉ chứa các câu lệnh thao tác với cơ sở dữ liệu. KHÔNG chứa logic nghiệp vụ.
 */
class UserRepository {
  /**
   * @description Tìm một người dùng dựa vào email
   * @returns {Promise<UserDTO | null>} Trả về toàn bộ thông tin User hoặc null nếu không tìm thấy
   */
  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  /**
   * @description Tạo mới một người dùng vào CSDL và tự động tạo Giỏ hàng rỗng
   * @param {CreateUserDTO} data - Dữ liệu DTO chuẩn từ Service truyền xuống
   * @returns {Promise<UserDTO>} Trả về User vừa được tạo
   */
  async createUser(data: CreateUserDTO): Promise<UserDTO> {
    const user = await prisma.user.create({
      data: {
        ...data,
        // Dùng Nested Writes để tạo luôn một Giỏ hàng rỗng cho User này
        cart: {
          create: {}
        }
      },
    });
    return user;
  }
}

export const userRepository = new UserRepository();
