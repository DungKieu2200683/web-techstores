/**
 * @description Định nghĩa kiểu dữ liệu DTO cho Module Đánh giá (Review)
 */

export interface ReviewDTO {
  id: string;
  userId: string;
  productId: string;
  rating: number; // 1 -> 5
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Dữ liệu mở rộng để hiển thị trên UI
  user?: {
    fullName: string;
    avatarUrl?: string | null; // Dự phòng nếu có avatar
  };
}
/**
 * @description Đối tượng chuyển đổi dữ liệu (DTO) thống kê đánh giá sản phẩm.
 *
 * @property productId ID duy nhất của sản phẩm được thống kê.
 * @property averageRating Điểm số đánh giá trung bình của sản phẩm (Ví dụ: 4.5/5 sao).
 * @property totalReviews Tổng số lượt (số người) đã gửi đánh giá cho sản phẩm.
 */
export interface ReviewStatsDTO {
  productId: string;
  averageRating: number;
  totalReviews: number;
}
