import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/response.util";

class ReviewController {
  /**
   * @description Gửi hoặc cập nhật đánh giá (Yêu cầu Login)
   */
  upsertReview = catchAsync(async (req: Request, res: Response) => {
    // req.user được trích xuất từ Token
    const review = await reviewService.upsertReview(req.user!.id, req.body);
    sendSuccess(res, 201, "Cảm ơn bạn đã gửi đánh giá", review);
  });

  /**
   * @description Lấy danh sách đánh giá của 1 Sản phẩm (Public)
   */
  getProductReviews = catchAsync(async (req: Request, res: Response) => {
    // tách productId URL
    const productId = req.params.productId as string;
    const reviews = await reviewService.getProductReviews(productId);
    sendSuccess(res, 200, "Lấy danh sách đánh giá thành công", reviews);
  });

  /**
   * @description Lấy số liệu thống kê đánh giá của 1 Sản phẩm (Public)
   */
  getProductReviewStats = catchAsync(async (req: Request, res: Response) => {
    // tách productId URL
    const productId = req.params.productId as string;
    const stats = await reviewService.getProductReviewStats(productId);
    sendSuccess(res, 200, "Lấy thống kê đánh giá thành công", stats);
  });

  /**
   * @description Xóa 1 đánh giá (Yêu cầu Login)
   */
  deleteReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = req.params.id as string;
    await reviewService.deleteReview(req.user!.id, req.user!.role, reviewId);
    sendSuccess(res, 200, "Đã xóa đánh giá", null);
  });
}

export const reviewController = new ReviewController();
