import { bannerRepository } from "../repositories/banner.repository";
import { BannerInput } from "../validators/banner.validator";
import { BannerDTO } from "../types/banner.type";
import { AppError } from "../utils/AppError";

class BannerService {
  /**
   * @description Lấy danh sách các banner đang kích hoạt để hiển thị ngoài giao diện phía khách hàng (Client).
   * @returns Mảng chứa các đối tượng banner có trạng thái `isActive: true`. Chỉ dành cho Client
   */
  async getActiveBanners(): Promise<BannerDTO[]> {
    return await bannerRepository.getActiveBanners();
  }

  /**
   * @description Lấy toàn bộ danh sách banner trong hệ thống (bao gồm cả banner ẩn/bản nháp), phục vụ cho trang quản lý (Admin).
   * @returns Mảng chứa tất cả các bản ghi banner hiện có trong database. Chỉ dành cho Admin
   */
  async getAllBanners(): Promise<BannerDTO[]> {
    return await bannerRepository.getAllBanners();
  }

  /**
   * @description Khởi tạo một banner mới vào cơ sở dữ liệu.
   * @param data Dữ liệu cấu hình banner được gửi từ Client (`BannerInput`).
   * @returns Đối tượng banner vừa được tạo thành công (`BannerDTO`).
   */
  async createBanner(data: BannerInput): Promise<BannerDTO> {
    return await bannerRepository.createBanner(data);
  }

  /**
   * @description Cập nhật thông tin của một banner hiện có theo ID.
   * @param id Mã định danh của banner cần chỉnh sửa.
   * @param data Dữ liệu mới cần cập nhật (`BannerInput`).
   * @returns Đối tượng banner sau khi lưu thay đổi thành công (`BannerDTO`).
   * @throws {AppError} Mã lỗi 404 nếu không tìm thấy banner hợp lệ với ID được cung cấp.
   */
  async updateBanner(id: string, data: BannerInput): Promise<BannerDTO> {
    const banner = await bannerRepository.getBannerById(id);
    if (!banner) {
      throw new AppError(404, "Không tìm thấy Banner");
    }
    return await bannerRepository.updateBanner(id, data);
  }

  /**
   * @description Xóa vĩnh viễn một bản ghi banner ra khỏi hệ thống.
   * @param id Mã định danh của banner cần xóa.
   * @throws {AppError} Mã lỗi 404 nếu banner không tồn tại để thực hiện thao tác xóa.
   */
  async deleteBanner(id: string): Promise<void> {
    const banner = await bannerRepository.getBannerById(id);
    if (!banner) {
      throw new AppError(404, "Không tìm thấy Banner");
    }
    await bannerRepository.deleteBanner(id);
  }
}

export const bannerService = new BannerService();
