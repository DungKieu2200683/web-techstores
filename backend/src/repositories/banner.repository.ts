import { PrismaClient } from "@prisma/client";
import { BannerDTO } from "../types/banner.type";
import { BannerInput } from "../validators/banner.validator";

const prisma = new PrismaClient();

class BannerRepository {
  /**
   * @description Lấy danh sách Banners (Chỉ lấy banner đang Active cho khách)
   * @returns trả về danh sách BannerDTO có trạng thái isActive = true cho User
   */
  async getActiveBanners(): Promise<BannerDTO[]> {
    return await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * @description Lấy chi tiết 1 Banner
   */
  async getBannerById(id: string): Promise<BannerDTO | null> {
    return await prisma.banner.findUnique({
      where: { id },
    });
  }

  /**
   * @description Lấy toàn bộ Banners (Dành cho Admin quản lý)
   * @returns trả BannerDTO toàn bộ Banner cho Admin
   */
  async getAllBanners(): Promise<BannerDTO[]> {
    return await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * @description Thêm Banner mới (Admin)
   */
  async createBanner(data: BannerInput): Promise<BannerDTO> {
    return await prisma.banner.create({
      data,
    });
  }

  /**
   * @description Cập nhật Banner (Admin)
   */
  async updateBanner(id: string, data: BannerInput): Promise<BannerDTO> {
    return await prisma.banner.update({
      where: { id },
      data,
    });
  }

  /**
   * @description Xóa Banner (Admin)
   */
  async deleteBanner(id: string): Promise<void> {
    await prisma.banner.delete({
      where: { id },
    });
  }
}

export const bannerRepository = new BannerRepository();
