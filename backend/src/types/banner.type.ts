/**
 * @description Đối tượng chuyển đổi dữ liệu (DTO) cấu hình Banner quảng cáo hiển thị trên hệ thống.
 *
 * @property id Mã định danh duy nhất (UUID/CUID) của banner dưới database.
 * @property title Tiêu đề hoặc tên gọi của banner (phục vụ quản lý hoặc làm thẻ alt cho ảnh).
 * @property imageUrl Đường dẫn URL ảnh tuyệt đối (Link Cloudinary/S3).
 * @property linkUrl Đường dẫn điều hướng khi click vào banner (trả về `null` nếu là banner tĩnh).
 * @property isActive Trạng thái hiển thị (`true`: đang bật công khai, `false`: tạm ẩn/bản nháp).
 * @property createdAt Thời gian banner được khởi tạo trên hệ thống.
 */
export interface BannerDTO {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  createdAt: Date;
}
