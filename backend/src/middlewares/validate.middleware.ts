import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/response.util";

/**
 * @description Trạm kiểm soát (Middleware) xác thực dữ liệu đầu vào.
 * @business Nó sẽ chặn mọi request không đạt chuẩn lại trước khi chạm tới Controller.
 */
export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ép dữ liệu đi qua màng lọc Zod và hứng lấy dữ liệu đã được làm sạch (Strip & Coerce)
      const parsedData = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;

      // Thay vì gán trực tiếp (req.query = ... gây lỗi getter-only),
      // ta gán đè req.body (được phép) và update các thuộc tính của req.query, req.params
      req.body = parsedData.body;
      // thuộc tính req.query, req.params không cho phép ghi đè chỉ được đọc Read-only
      Object.keys(req.query).forEach((key) => delete req.query[key]); // dọn dẹp dữ liệu
      Object.assign(req.query, parsedData.query); // đỏ dũ liệu mới vào

      Object.keys(req.params).forEach((key) => delete req.params[key]);
      Object.assign(req.params, parsedData.params);
      // Nếu dữ liệu sạch, cho phép đi tiếp vào Controller
      next();
    } catch (error: any) {
      // Đẩy lỗi sang cho Lưới hứng lỗi toàn cục (Global Error Handler)
      next(error);
    }
  };
};
