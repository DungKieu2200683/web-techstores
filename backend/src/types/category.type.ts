/**
 * @description Định nghĩa các kiểu dữ liệu DTO cho thực thể Danh mục (Category)
 */

/**
 * @description Cấu trúc hoàn chỉnh của một Danh mục
 */
export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Data Transfer Object (DTO) dùng để tạo mới hoặc cập nhật Danh mục
 */
export interface CreateCategoryDTO {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}
