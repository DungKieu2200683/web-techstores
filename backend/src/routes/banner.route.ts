import { Router } from 'express';
import { bannerController } from '../controllers/banner.controller';
import { validate } from '../middlewares/validate.middleware';
import { bannerSchema } from '../validators/banner.validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const bannerRouter = Router();

// ==========================================
// API PUBLIC (Dành cho Khách hàng xem)
// ==========================================
bannerRouter.get('/active', bannerController.getActiveBanners);

// ==========================================
// API PROTECTED (Chỉ dành cho ADMIN quản lý)
// ==========================================
bannerRouter.use(protect, restrictTo('ADMIN'));

// Lấy toàn bộ Banner
bannerRouter.get('/', bannerController.getAllBanners);

// Thêm Banner mới
bannerRouter.post('/', validate(bannerSchema), bannerController.createBanner);

// Cập nhật Banner
bannerRouter.put('/:id', validate(bannerSchema), bannerController.updateBanner);

// Xóa Banner
bannerRouter.delete('/:id', bannerController.deleteBanner);

export default bannerRouter;
