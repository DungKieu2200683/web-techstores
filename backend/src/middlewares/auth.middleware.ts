import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import { AppError } from "../utils/AppError";
import { JwtPayload } from "../types/user.type";

// Bổ sung kiểu dữ liệu cho req.user để TypeScript không báo lỗi
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * @description Middleware xác thực Bearer Token (JWT). Nếu hợp lệ, gán dữ liệu giải mã vào `req.user` để các Controller phía sau sử dụng.
 * @business Kiểm tra xem Request có mang theo Thẻ thông hành (Token) hợp lệ hay không.
 * @throws `AppError` (401) nếu không có token, token giả mạo hoặc đã hết hạn.
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Lấy token từ Header (Định dạng: Bearer <token>)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // tách token
    }

    if (!token) {
      throw new AppError(
        401,
        "Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.",
      );
    }

    // 2. Giải mã Token
    const decoded = verifyToken(token);

    // 3. Cấp phép đi qua và đính kèm thông tin user vào Request
    req.user = decoded;

    next();
  } catch (error: any) {
    // Nếu token hết hạn hoặc bị làm giả
    next(new AppError(401, "Token không hợp lệ hoặc đã hết hạn!"));
  }
};

/**
 * @description Middleware phân quyền (RBAC). Kiểm tra xem `req.user.role` có nằm trong danh sách các quyền (`roles`) được phép truy cập hay không.
 * @param roles Danh sách các vai trò được phép truy cập API (Ví dụ: 'ADMIN', 'MANAGER').
 * @throws `AppError` (403) nếu người dùng không có quyền truy cập.
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // kiểm tra xem người đăng nhập có nằm trong mảng role không
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(403, "Bạn không có quyền thực hiện hành động này!"),
      );
    }
    next();
  };
};
