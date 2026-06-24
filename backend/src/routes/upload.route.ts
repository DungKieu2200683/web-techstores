import { Router } from "express";
import { uploadController } from "../controllers/upload.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const uploadRouter = Router();

// ==========================================
// TẤT CẢ API UPLOAD ĐỀU YÊU CẦU ĐĂNG NHẬP
// ==========================================
uploadRouter.use(protect);

// API up ảnh Sản phẩm (Chỉ Admin)
// 'image' là tên của field trong multipart/form-data
// des : thêm 1 hình ảnh sản phẩm
uploadRouter.post(
  "/product",
  restrictTo("ADMIN"),
  uploadMiddleware.single("image"),
  uploadController.uploadProductImage,
);

// API up NHIỀU ảnh Sản phẩm cùng lúc (Chỉ Admin, tối đa 10 ảnh)
uploadRouter.post(
  "/products",
  restrictTo("ADMIN"),
  uploadMiddleware.array("images", 10),
  uploadController.uploadMultipleProductImages,
);

// API up ảnh Banner (Chỉ Admin)
// des : thêm 1 hình ảnh banner
uploadRouter.post(
  "/banner",
  restrictTo("ADMIN"),
  uploadMiddleware.single("image"),
  uploadController.uploadBannerImage,
);

// API up NHIỀU ảnh Banner cùng lúc (Chỉ Admin, tối đa 10 ảnh)
uploadRouter.post(
  "/banners",
  restrictTo("ADMIN"),
  uploadMiddleware.array("images", 10),
  uploadController.uploadMultipleBannerImages,
);

// API up ảnh Avatar (Admin + Khách hàng đều xài được)
// Chỉ cần 'protect' (Đã login) là qua được vòng này
uploadRouter.post(
  "/avatar",
  uploadMiddleware.single("image"),
  uploadController.uploadAvatar,
);

export default uploadRouter;
