/**
 * @description Định nghĩa các kiểu dữ liệu cốt lõi (Domain Models & DTOs) cho thực thể User.
 * @business Việc tách riêng ra đây giúp hệ thống không bị phụ thuộc vào Prisma. Sau này nếu đổi Database hoặc ORM, ta chỉ cần giữ nguyên file này, tầng Service sẽ không bao giờ bị lỗi.
 */

// 1. Domain Entity: Cấu trúc hoàn chỉnh của một người dùng
export interface UserDTO {
  id: string;
  email: string;
  password?: string; // Tồn tại trong DB nhưng có thể bị xóa đi trước khi gửi cho Frontend
  fullName: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN' | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Data Transfer Object (DTO): Cấu trúc dữ liệu cần thiết để tạo mới một người dùng
export interface CreateUserDTO {
  email: string;
  password: string; // Bắt buộc phải có khi đăng ký
  fullName: string;
  phone?: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

// 3. Kiểu dữ liệu trả về cho Frontend (Bảo mật, không chứa password)
export type UserResponse = Omit<UserDTO, 'password'>;

// 4. Data Transfer Object (DTO): Cấu trúc dữ liệu đầu vào cho Login
export interface LoginDTO {
  email: string;
  password: string;
}

// 5. Cấu trúc Payload chứa bên trong JWT Token
export interface JwtPayload {
  id: string;
  role: string;
}
