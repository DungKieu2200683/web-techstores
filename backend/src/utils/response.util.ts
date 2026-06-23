import { Response } from 'express';

/**
 * @description Trả về JSON thành công chuẩn xác cho toàn bộ API
 * @param res Response object của Express
 * @param statusCode Mã HTTP (Ví dụ: 200, 201)
 * @param message Lời nhắn thân thiện cho Frontend
 * @param data Dữ liệu thực tế (nếu có)
 */
export const sendSuccess = (res: Response, statusCode: number, message: string, data: any = null) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * @description Trả về JSON báo lỗi chuẩn xác cho toàn bộ API
 * @param res Response object của Express
 * @param statusCode Mã HTTP (Ví dụ: 400, 401, 404, 500)
 * @param message Lời nhắn lỗi cho Frontend hiển thị
 * @param errors Chi tiết lỗi (Ví dụ: mảng lỗi từ Zod Validator)
 */
export const sendError = (res: Response, statusCode: number, message: string, errors: any = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};
