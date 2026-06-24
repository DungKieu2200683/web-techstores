import multer from "multer";
import { AppError } from "../utils/AppError";

// Cấu hình Multer để lưu tạm file vào RAM (MemoryStorage)
/**
 * @description Chiến lược lưu trữ tệp tin trong bộ nhớ RAM (Memory Storage) của Multer.
 *
 * @note Khi sử dụng cấu hình này, toàn bộ dữ liệu của tệp tin tải lên sẽ được chuyển đổi và lưu giữ dưới dạng các đối tượng `Buffer` trong bộ nhớ RAM thay vì ghi trực tiếp xuống ổ đĩa cứng của máy chủ.
 * Giải pháp này giúp tối ưu hóa tốc độ xử lý I/O và cực kỳ phù hợp cho các kịch bản cần chuyển tiếp dữ liệu (Forward) thẳng lên các dịch vụ Cloud như Cloudinary, AWS S3... mà không để lại tệp tin rác trên Server.
 */
const storage = multer.memoryStorage();

// Bộ lọc (Filter) chỉ cho phép upload file Hình Ảnh
/**
 * @description Bộ lọc tệp tin (File Filter) cho Multer, đảm bảo hệ thống chỉ chấp nhận dữ liệu tải lên có định dạng là hình ảnh (JPEG, PNG, WEBP...).
 * @param req Đối tượng Request của Express.
 * @param file Đối tượng chứa toàn bộ siêu dữ liệu (metadata) của tệp tin đang được xử lý.
 * @param cb Hàm callback điều hướng của Multer dùng để chấp nhận tệp (`cb(null, true)`) hoặc từ chối bằng cách trả về một `AppError` (400).
 */
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "File không hợp lệ! Vui lòng chỉ tải lên Hình Ảnh."));
  }
};

/**
 * @description Cấu hình Middleware Multer dùng để xử lý, kiểm duyệt và quản lý các tệp tin được tải lên từ Client.
 *
 * @note Các ràng buộc bảo mật và hiệu năng được áp dụng:
 * - **Bộ lọc tệp tin (`fileFilter`):** Chỉ chấp nhận các định dạng là hình ảnh hợp lệ.
 * - **Giới hạn dung lượng (`fileSize`):** Tối đa **5MB** cho mỗi tệp tin. Nếu người dùng cố tình tải file lớn hơn, Multer sẽ tự động kích hoạt mã lỗi `LIMIT_FILE_SIZE`.
 * - **Chiến lược lưu trữ (`storage`):** Cơ chế lưu trữ vật lý hoặc lưu trữ tạm thời được điều hướng bởi biến `storage` định sẵn.
 */
export const uploadMiddleware = multer({
  storage, // chỗ lưu ảnh
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
