import { PrismaClient } from "@prisma/client";
import { BrandDTO, CreateBrandDTO } from "../types/brand.type";

const prisma = new PrismaClient();

/**
 * @description Tầng Repository kết nối trực tiếp với CSDL cho thực thể Brand
 */
class BrandRepository {
  /**
   * @description Lấy danh sách tất cả thương hiệu sản phẩm.
   * @returns Mảng danh sách toàn bộ thương hiệu (`BrandDTO[]`).
   */
  async getAllBrands(): Promise<BrandDTO[]> {
    const brands = await prisma.brand.findMany();
    return brands as unknown as BrandDTO[];
  }

  /**
   * @description Lấy chi tiết một thương hiệu theo Slug.
   * @param slug Chuỗi định danh duy nhất của thương hiệu trên URL (Ví dụ: "apple").
   * @returns Đối tượng thương hiệu BrandDTO khi tìm thấy, hoặc `null` nếu không tồn tại.
   */
  async getBrandBySlug(slug: string): Promise<BrandDTO | null> {
    const brand = await prisma.brand.findUnique({
      where: { slug },
    });
    return brand as unknown as BrandDTO | null;
  }

  /**
   * @description Tạo một thương hiệu mới.
   * @param slug Chuỗi định danh duy nhất của thương hiệu trên URL.
   * @param data Đối tượng chứa dữ liệu đầu vào để tạo thương hiệu (`CreateBrandDTO`).
   * @returns Đối tượng thương hiệu vừa tạo thành công (`BrandDTO`).
   */
  async createBrand(slug: string, data: CreateBrandDTO): Promise<BrandDTO> {
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: slug,
        logoUrl: data.logoUrl,
      },
    });
    return brand as unknown as BrandDTO;
  }
}

export const brandRepository = new BrandRepository();
