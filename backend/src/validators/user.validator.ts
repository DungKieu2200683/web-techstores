import { z } from 'zod';

/**
 * @description Schema kiểm tra dữ liệu đầu vào khi Đăng ký
 */
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    fullName: z.string().min(2, 'Họ tên quá ngắn').max(50, 'Họ tên quá dài')
  })
});

/**
 * @description Schema kiểm tra dữ liệu đầu vào khi Đăng nhập
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'), // Khi login chỉ cần check có nhập hay không
  })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
