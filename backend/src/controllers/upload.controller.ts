import { Request, Response } from "express";
import { uploadService } from "../services/upload.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/response.util";
import { AppError } from "../utils/AppError";

class UploadController {
  /**
   * @description Xử lý Upload 1 ảnh (Tách thư mục theo loại ảnh)
   */
  private async processUpload(req: Request, res: Response, folder: string) {
    if (!req.file) {
      throw new AppError(400, "Vui lòng chọn một file ảnh để tải lên");
    }

    const imageUrl = await uploadService.uploadImageFromBuffer(
      req.file.buffer,
      folder,
    );

    sendSuccess(res, 200, "Tải ảnh lên thành công", { url: imageUrl });
  }

  /**
   * @description Dành cho ADMIN: Upload 1 ảnh sản phẩm
   */
  uploadProductImage = catchAsync(async (req: Request, res: Response) => {
    await this.processUpload(req, res, "techstore/products");
  });

  /**
   * @description Dành cho ADMIN: Upload 1 ảnh Banner
   */
  uploadBannerImage = catchAsync(async (req: Request, res: Response) => {
    await this.processUpload(req, res, "techstore/banners");
  });

  /**
   * @description Dành cho MỌI NGƯỜI: Upload Avatar cá nhân
   */
  uploadAvatar = catchAsync(async (req: Request, res: Response) => {
    await this.processUpload(req, res, "techstore/avatars");
  });

  /**
   * @description Xử lý Upload nhiều ảnh cùng lúc
   */
  private async processMultipleUpload(
    req: Request,
    res: Response,
    folder: string,
  ) {
    // req.files khi dùng multer.array() sẽ trả về mảng File
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError(400, "Vui lòng chọn ít nhất một file ảnh để tải lên");
    }

    const imageUrls = await uploadService.uploadMultipleImagesFromBuffer(
      files,
      folder,
    );

    sendSuccess(res, 200, "Tải danh sách ảnh lên thành công", {
      urls: imageUrls,
    });
  }

  /**
   * @description Dành cho ADMIN: Upload NHIỀU ảnh sản phẩm cùng lúc (VD: Album ảnh)
   */
  uploadMultipleProductImages = catchAsync(
    async (req: Request, res: Response) => {
      await this.processMultipleUpload(req, res, "techstore/products");
    },
  );

  /**
   * @description Dành cho ADMIN: Upload NHIỀU ảnh Banner cùng lúc
   */
  uploadMultipleBannerImages = catchAsync(
    async (req: Request, res: Response) => {
      await this.processMultipleUpload(req, res, "techstore/banners");
    },
  );
}

export const uploadController = new UploadController();
