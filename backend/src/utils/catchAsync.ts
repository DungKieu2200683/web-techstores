import { Request, Response, NextFunction } from 'express';

/**
 * @description Bọc các hàm bất đồng bộ (async) trong Controller để tự động bắt lỗi
 * @business Giúp Controller sạch sẽ, xóa bỏ hoàn toàn try...catch lặp đi lặp lại.
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Chạy hàm fn, nếu có lỗi (reject) thì đẩy thẳng vào lưới hứng lỗi (next)
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
