import { categoryRepository } from "../repositories/category.repository";
import { CreateCategoryInput } from "../validators/category.validator";
import { generateSlug } from "../utils/slugify.util";
import { AppError } from "../utils/AppError";
import { CategoryDTO } from "../types/category.type";

/**
 * @description Tầng Service xử lý logic nghiệp vụ cho Danh mục (Category)
 */
class CategoryService {
  /**
   * @description Lấy toàn bộ danh sách danh mục sản phẩm từ tầng Repository.
   * @returns Mảng danh sách toàn bộ danh mục (`CategoryDTO[]`).
   */
  async getAllCategories(): Promise<CategoryDTO[]> {
    return await categoryRepository.getAllCategories();
  }

  /**
   * @description Tạo danh mục mới sau khi tự động tạo và kiểm tra trùng lặp Slug.
   * @param payload Dữ liệu đầu vào để tạo danh mục (`CreateCategoryInput`).
   * @returns Đối tượng danh mục vừa tạo thành công (`CategoryDTO`).
   * @throws `AppError` (400) nếu tên danh mục (Slug) đã tồn tại trong hệ thống.
   */
  async createCategory(payload: CreateCategoryInput): Promise<CategoryDTO> {
    const slug = generateSlug(payload.name);

    const existing = await categoryRepository.getCategoryBySlug(slug);
    if (existing) {
      throw new AppError(400, "Tên danh mục này đã tồn tại");
    }

    return await categoryRepository.createCategory(slug, payload);
  }
}

export const categoryService = new CategoryService();
