/**
 * @description Đối tượng chuyển đổi dữ liệu (DTO) đại diện cho một mục trong danh sách yêu thích (Wishlist) của người dùng.
 *
 * @property id Mã định danh duy nhất (UUID/CUID) của mục yêu thích này dưới cơ sở dữ liệu.
 * @property userId ID của người dùng sở hữu mục yêu thích này (Liên kết sang bảng User).
 * @property productId ID của sản phẩm được người dùng thêm vào danh sách yêu thích (Liên kết sang bảng Product).
 * @property createdAt Thời gian sản phẩm này được thêm vào danh sách yêu thích.
 * @property product[] (Tùy chọn) Đối tượng chứa thông tin chi tiết của sản phẩm đi kèm khi thực hiện truy vấn nạp dữ liệu liên quan (Eager Loading/Include).
 */
export interface WishlistDTO {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  product?: any;
}
