/**
 * @description Định nghĩa các kiểu dữ liệu DTO cho thực thể Thương hiệu (Brand)
 */

/**
 * @description Cấu trúc hoàn chỉnh của một Thương hiệu
 */
export interface BrandDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Data Transfer Object (DTO) dùng để tạo mới hoặc cập nhật Thương hiệu
 */
export interface CreateBrandDTO {
  name: string;
  logoUrl?: string;
}
