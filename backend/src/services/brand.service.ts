import { brandRepository } from "../repositories/brand.repository";
import { CreateBrandInput } from "../validators/brand.validator";
import { generateSlug } from "../utils/slugify.util";
import { AppError } from "../utils/AppError";
import { BrandDTO } from "../types/brand.type";

/**
 * @description Tầng Service xử lý logic nghiệp vụ cho Thương hiệu (Brand)
 */
class BrandService {
  /**
   * @description Lấy toàn bộ danh sách thương hiệu từ tầng Repository.
   * @returns Mảng danh sách toàn bộ thương hiệu (`BrandDTO[]`).
   */
  async getAllBrands(): Promise<BrandDTO[]> {
    return await brandRepository.getAllBrands();
  }

  /**
   * @description Tạo thương hiệu mới sau khi tự động tạo và kiểm tra trùng lặp Slug.
   * @param payload Dữ liệu đầu vào để tạo thương hiệu (`CreateBrandInput`). trong validate
   * @returns Đối tượng thương hiệu vừa tạo thành công (`BrandDTO`).
   * @throws `AppError` (400) nếu tên thương hiệu (Slug) đã tồn tại trong hệ thống.
   */
  async createBrand(payload: CreateBrandInput): Promise<BrandDTO> {
    const slug = generateSlug(payload.name);

    const existing = await brandRepository.getBrandBySlug(slug);
    if (existing) {
      throw new AppError(400, "Tên thương hiệu này đã tồn tại");
    }

    return await brandRepository.createBrand(slug, payload);
  }
}

export const brandService = new BrandService();
