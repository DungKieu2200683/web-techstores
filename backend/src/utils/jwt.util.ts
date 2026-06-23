import jwt from "jsonwebtoken";

/**
 * @description Hàm tạo chữ ký điện tử (Token) cho hệ thống
 * @param userId ID của người dùng (Để sau này lấy ra)
 * @param role Quyền hạn của người dùng (Khách hay Admin)
 * @returns Chuỗi Token mã hóa
 */
export const generateToken = (userId: string, role: string): string => {
  const payload = { id: userId, role };

  // Lấy khóa bí mật từ .env
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("Chưa cấu hình biến môi trường JWT_SECRET");
  }
  // đăng ký token
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

/**
 * @description Hàm giải mã Token để kiểm tra tính hợp lệ
 * @param token Chuỗi Token cần kiểm tra
 * @returns Dữ liệu đã được giải mã (payload)
 */
export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Chưa cấu hình biến môi trường JWT_SECRET");
  }

  return jwt.verify(token, secret);
};
