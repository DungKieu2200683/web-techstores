/**
 * @description Class chuẩn hóa lỗi toàn hệ thống
 * @business Thay vì quăng lỗi chung chung (Error), ta quăng AppError kèm theo mã HTTP tương ứng.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // Đánh dấu đây là lỗi do con người/nghiệp vụ tạo ra (ví dụ: Sai mật khẩu),
    // không phải lỗi sập server (ví dụ: Mất kết nối DB).
    this.isOperational = true;

    // Giữ nguyên stack trace để dễ debug
    // this chính là name : Error , this.constructor là super(message); tên lỗi gửi từ AppError
    Error.captureStackTrace(this, this.constructor);
  }
}
