import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response.util';
import { ZodError } from 'zod';

/**
 * @description Lưới hứng lỗi toàn cục (Global Error Handler)
 * @business Bắt mọi lỗi xảy ra trong toàn hệ thống, format lại cho đẹp trước khi trả về cho khách.
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Lấy mã lỗi, mặc định là 500 (Internal Server Error) nếu lỗi không xác định
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Đã có lỗi nghiêm trọng xảy ra trên Server';

  // Trong môi trường Development, ta trả về chi tiết Stack Trace để dev dễ sửa
  // Trong môi trường Production, giấu Stack Trace đi để tránh lộ cấu trúc code
  const isDev = process.env.NODE_ENV === 'development';

  // 1. Xử lý lỗi Zod Validator (Đầu vào không hợp lệ)
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Dữ liệu đầu vào không hợp lệ';
    
    // Format lại mảng lỗi của Zod cho dễ đọc hơn
    const formattedErrors = err.issues.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return sendError(res, statusCode, message, formattedErrors);
  }

  // 2. Xử lý lỗi nghiệp vụ do chúng ta chủ động quăng ra (AppError)
  if (err instanceof AppError) {
    return sendError(res, statusCode, message, isDev ? err.stack : null);
  }

  // 3. Nếu là lỗi lạ (như rớt mạng, sập DB), in ra console cho DevOps kiểm tra
  if (!err.isOperational) {
    console.error('💥 LỖI HỆ THỐNG:', err);
  }

  // Trả về JSON chuẩn mực
  sendError(res, statusCode, message, isDev ? err.stack : null);
};
