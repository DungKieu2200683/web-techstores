import { reviewRepository } from '../repositories/review.repository';
import { ReviewInput } from '../validators/review.validator';
import { AppError } from '../utils/AppError';
import { ReviewDTO, ReviewStatsDTO } from '../types/review.type';

/**
 * @description Tầng Service xử lý logic nghiệp vụ cho Đánh giá Sản phẩm (Review)
 */
class ReviewService {
  /**
   * @description Xử lý hành động gửi Đánh giá của Khách hàng
   */
  async upsertReview(userId: string, payload: ReviewInput): Promise<ReviewDTO> {
    const { productId, rating, comment } = payload;

    // 1. Kiểm duyệt nghiêm ngặt: Xác minh đã mua hàng (Verified Purchase)
    const isVerified = await reviewRepository.checkVerifiedPurchase(userId, productId);
    
    if (!isVerified) {
      throw new AppError(403, 'Bạn chỉ được phép đánh giá sau khi đã mua và nhận thành công sản phẩm này.');
    }

    // 2. Tiến hành lưu đánh giá vào CSDL
    return await reviewRepository.upsertReview(userId, productId, rating, comment);
  }

  /**
   * @description Lấy danh sách đánh giá của 1 Sản phẩm
   */
  async getProductReviews(productId: string): Promise<ReviewDTO[]> {
    return await reviewRepository.getReviewsByProduct(productId);
  }

  /**
   * @description Lấy Thống kê Điểm trung bình của 1 Sản phẩm
   */
  async getProductReviewStats(productId: string): Promise<ReviewStatsDTO> {
    return await reviewRepository.getReviewStats(productId);
  }

  /**
   * @description Xóa 1 đánh giá (Chỉ Admin hoặc người tạo ra đánh giá mới được xóa)
   */
  async deleteReview(userId: string, userRole: string, reviewId: string): Promise<void> {
    const review = await reviewRepository.getReviewById(reviewId);
    if (!review) {
      throw new AppError(404, 'Không tìm thấy đánh giá');
    }

    // Kiểm tra quyền hạn: Phải là Admin, hoặc chính chủ của Review đó
    if (userRole !== 'ADMIN' && review.userId !== userId) {
      throw new AppError(403, 'Bạn không có quyền xóa đánh giá của người khác');
    }

    await reviewRepository.deleteReview(reviewId);
  }
}

export const reviewService = new ReviewService();
