import { PrismaClient } from "@prisma/client";
import { ReviewDTO, ReviewStatsDTO } from "../types/review.type";

const prisma = new PrismaClient();

/**
 * @description Tầng Repository kết nối CSDL cho Module Đánh giá (Review).
 * Chứa thuật toán kiểm duyệt "Verified Purchase" (Bắt buộc mua hàng).
 */
class ReviewRepository {
  /**
   * @description Thuật toán Verified Purchase: Kiểm tra xem User đã từng mua Sản phẩm này và đơn hàng đã giao thành công (DELIVERED) hay chưa.
   * Chọc qua 4 bảng: OrderItem -> Order -> User & OrderItem -> ProductVariant -> Product
   * @returns trả true/false
   */
  async checkVerifiedPurchase(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const verifiedOrder = await prisma.orderItem.findFirst({
      where: {
        // Điều kiện 1: Đơn hàng thuộc về User và đã giao thành công
        order: {
          userId: userId,
          status: "DELIVERED",
        },
        // Điều kiện 2: Sản phẩm trong đơn hàng đó (Biến thể) phải thuộc về Product đang cần đánh giá
        variant: {
          productId: productId,
        },
      },
    });

    return !!verifiedOrder; // Trả về true nếu tìm thấy, false nếu không
  }

  /**
   * @description Lấy Review cũ của User cho Sản phẩm này (nếu có)
   * @returns trả về Review của người dùng mục đích kiểm tra xem đã bình luận cho sản phẩm này chưa
   */
  async getExistingReview(userId: string, productId: string) {
    return await prisma.review.findFirst({
      where: { userId, productId },
    });
  }

  /**
   * @description Tạo mới hoặc Cập nhật (Upsert) Đánh giá của User cho 1 Sản phẩm.
   * Mỗi User chỉ có tối đa 1 Review cho 1 Product.
   */
  async upsertReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string | null | undefined,
  ): Promise<ReviewDTO> {
    // kiểm tra xem người dùng đã bình luận chưa
    const existing = await this.getExistingReview(userId, productId);

    let review;
    if (existing) {
      // Đã từng đánh giá -> Cập nhật lại
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment },
      });
    } else {
      // Chưa từng đánh giá -> Tạo mới
      review = await prisma.review.create({
        data: { userId, productId, rating, comment },
      });
    }

    return review as unknown as ReviewDTO;
  }

  /**
   * @description Lấy danh sách toàn bộ Đánh giá của 1 Sản phẩm để hiển thị cho Khách xem (Public)
   * @returns trả về danh sách bình luận của sản phẩm
   */
  async getReviewsByProduct(productId: string): Promise<ReviewDTO[]> {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { updatedAt: "desc" }, // Hiển thị đánh giá mới nhất lên đầu
      include: {
        user: {
          select: { fullName: true }, // Lấy tên User để hiển thị
        },
      },
    });
    return reviews as unknown as ReviewDTO[];
  }

  /**
   * @description Thống kê số liệu đánh giá sản phẩm bằng phương thức Aggregate của Prisma.
   * @param productId ID duy nhất của sản phẩm cần gom cụm thống kê.
   * @returns Đối tượng chứa kết quả thống kê tổng hợp (`ReviewStatsDTO`).
   */
  async getReviewStats(productId: string): Promise<ReviewStatsDTO> {
    /**
     * @description Kết quả gom cụm (Aggregate) chứa tổng số lượng bản ghi và điểm đánh giá trung bình thô từ Database.
     * @example
     * {
     *   "_count": { "id": 5 },
     *   "_avg": { "rating": 4.33 }
     * }
     */
    const stats = await prisma.review.aggregate({
      where: { productId },
      _count: { id: true },
      _avg: { rating: true },
    });

    return {
      productId,
      totalReviews: stats._count.id || 0,
      averageRating: stats._avg.rating
        ? Number(stats._avg.rating.toFixed(1))
        : 0,
    };
  }

  /**
   * @description Xóa một đánh giá
   */
  async deleteReview(reviewId: string): Promise<void> {
    await prisma.review.delete({
      where: { id: reviewId },
    });
  }

  /**
   * @description Lấy chi tiết 1 Review bằng ID
   */
  async getReviewById(reviewId: string) {
    return await prisma.review.findUnique({
      where: { id: reviewId },
    });
  }
}

export const reviewRepository = new ReviewRepository();
