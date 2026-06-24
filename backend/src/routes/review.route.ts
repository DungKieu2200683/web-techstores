import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { reviewSchema } from '../validators/review.validator';
import { protect } from '../middlewares/auth.middleware';

const reviewRouter = Router();

// ==========================================
// API PUBLIC (Không cần Login)
// ==========================================

// Lấy danh sách đánh giá của 1 Sản phẩm
reviewRouter.get('/product/:productId', reviewController.getProductReviews);

// Lấy thống kê số sao của 1 Sản phẩm
reviewRouter.get('/product/:productId/stats', reviewController.getProductReviewStats);

// ==========================================
// API PROTECTED (Bắt buộc Login)
// ==========================================
reviewRouter.use(protect);

// Gửi mới hoặc cập nhật đánh giá (Yêu cầu Verified Purchase)
reviewRouter.post('/', validate(reviewSchema), reviewController.upsertReview);

// Xóa đánh giá
reviewRouter.delete('/:id', reviewController.deleteReview);

export default reviewRouter;
