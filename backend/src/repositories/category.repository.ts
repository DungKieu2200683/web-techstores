import { PrismaClient } from "@prisma/client";
import { CategoryDTO, CreateCategoryDTO } from "../types/category.type";

const prisma = new PrismaClient();

/**
 * @description Tầng Repository kết nối trực tiếp với CSDL cho thực thể Category
 */
class CategoryRepository {
  /**
   * @description Lấy tất cả danh mục lồng kèm danh mục con (Cấu trúc cây / Đa cấp).
   * @returns Mảng danh mục cha, trong mỗi cha có chứa mảng `children` (danh mục con).
   */
  async getAllCategories(): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({
      include: {
        children: true, // Tự động lấy danh mục con
      },
    });
    return categories as unknown as CategoryDTO[];
  }

  /**
   * @description Lấy chi tiết một danh mục theo Slug kèm các danh mục con trực thuộc.
   * @param slug Chuỗi định danh duy nhất của danh mục trên URL (Ví dụ: "laptop", "dien-thoai").
   * @returns Đối tượng danh mục kèm mảng `children`, hoặc `null` nếu không tìm thấy.
   */
  async getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { children: true },
    });
    return category as unknown as CategoryDTO | null;
  }

  /**
   * @description Tạo một danh mục mới (Hỗ trợ cả danh mục cha hoặc danh mục con nếu truyền parentId).
   * @param slug Chuỗi định danh duy nhất của danh mục trên URL (Ví dụ: "dien-thoai-samsung").
   * @param data Đối tượng chứa thông tin đầu vào để tạo danh mục (`CreateCategoryDTO`).
   * @returns Đối tượng danh mục vừa tạo thành công (`CategoryDTO`).
   */
  async createCategory(
    slug: string,
    data: CreateCategoryDTO,
  ): Promise<CategoryDTO> {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId: data.parentId,
      },
    });
    return category as unknown as CategoryDTO;
  }
}

export const categoryRepository = new CategoryRepository();
