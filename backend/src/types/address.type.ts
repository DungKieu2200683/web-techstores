/**
 * @description Đối tượng chuyển đổi dữ liệu (DTO) đại diện cho thông tin địa chỉ giao hàng của người dùng.
 *
 * @property id Mã định danh duy nhất (UUID/CUID) của địa chỉ dưới cơ sở dữ liệu.
 * @property userId ID của người dùng sở hữu địa chỉ này (Liên kết sang bảng User).
 * @property street Thông tin số nhà, tên đường, ngõ ngách hoặc tòa nhà cụ thể.
 * @property city Tên Thành phố hoặc Tỉnh thành.
 * @property state Tên Quận, Huyện hoặc Thị xã (hoặc Bang/Tỉnh tùy theo cấu trúc địa lý).
 * @property zipCode Mã bưu chính của khu vực (trả về `null` nếu không cung cấp hoặc không bắt buộc).
 * @property isDefault Trạng thái địa chỉ mặc định (`true`: địa chỉ ưu tiên hàng đầu khi đặt hàng, `false`: địa chỉ phụ).
 */
export interface AddressDTO {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string | null;
  isDefault: boolean;
}
