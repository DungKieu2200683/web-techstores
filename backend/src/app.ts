import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import rootRouter from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

/**
 * @description Khởi tạo ứng dụng Express framework
 * @business Nghĩa vụ của app là điểm tiếp nhận mọi luồng traffic đi vào hệ thống TechStore
 */
const app: Application = express();

// ==========================================
// MIDDLEWARES TOÀN CỤC (GLOBAL MIDDLEWARES)
// ==========================================

/**
 * @description Cho phép Frontend (React) ở các domain khác gọi API vào Backend này mà không bị trình duyệt chặn (CORS Error)
 */
app.use(cors());

/**
 * @description Parse body của HTTP request có định dạng JSON thành object JavaScript (req.body)
 */
app.use(express.json());

/**
 * @description Parse body của HTTP request từ HTML forms (application/x-www-form-urlencoded)
 */
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES (ĐƯỜNG DẪN API)
// ==========================================

/**
 * @description Health check API
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "TechStore API is running smoothly 🚀",
  });
});

/**
 * @description Gắn toàn bộ API của dự án vào tiền tố /api
 */
app.use("/api", rootRouter);

// ==========================================
// BẪY LỖI TOÀN CỤC (GLOBAL ERROR HANDLER)
// ==========================================
// Bắt buộc phải nằm ở vị trí cuối cùng này
app.use(globalErrorHandler);

export default app;
