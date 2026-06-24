import cloudinary from "../utils/cloudinary.config";
import streamifier from "streamifier";
import { AppError } from "../utils/AppError";

/**
 * @description Tầng Service xử lý upload Stream trực tiếp lên Cloudinary
 */
class UploadService {
  /**
   * @description Biến file từ RAM (Buffer) thành Stream và đẩy lên Cloudinary
   * @note Hỗ trợ thêm 1 ảnh
   * @param fileBuffer Dữ liệu file nằm trên RAM
   * @param folderName Thư mục lưu trữ trên Cloud (VD: 'techstore/products', 'techstore/avatars')
   * @returns URL public của hình ảnh
   */
  async uploadImageFromBuffer(
    fileBuffer: Buffer,
    folderName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          // Tự động nén và tối ưu hóa ảnh của Cloudinary
          format: "webp",
          quality: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Lỗi Cloudinary:", error);
            return reject(new AppError(500, "Không thể tải ảnh lên máy chủ"));
          }
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(new AppError(500, "Lỗi không xác định khi tải ảnh"));
          }
        },
      );

      // Chuyển Buffer thành Stream và đổ vào uploadStream
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * @description Upload nhiều file cùng lúc (Sử dụng chạy song song Promise.all để tối đa hóa tốc độ)
   * @note  Hỗ trợ thêm nhiều ảnh ảnh
   * @param files Mảng các file lấy từ Multer (req.files)
   * @param folderName Thư mục lưu trữ
   * @returns Danh sách các URL trả về từ Cloudinary
   */
  async uploadMultipleImagesFromBuffer(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<string[]> {
    // Chạy upload song song tất cả các file để tiết kiệm thời gian
    const uploadPromises = files.map((file) =>
      this.uploadImageFromBuffer(file.buffer, folderName),
    );
    return Promise.all(uploadPromises);
  }
}

export const uploadService = new UploadService();
