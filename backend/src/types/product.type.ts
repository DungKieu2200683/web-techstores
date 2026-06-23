/**
 * @description Định nghĩa các kiểu dữ liệu cốt lõi (DTOs) cho thực thể Product
 */

// 1. Domain Entities
export interface ProductVariantDTO {
  id?: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export interface ProductImageDTO {
  id?: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductSpecificationDTO {
  id?: string;
  name: string;
  value: string;
}

export interface ProductDTO {
  id: string;
  categoryId: string;
  brandId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Quan hệ
  variants?: ProductVariantDTO[];
  images?: ProductImageDTO[];
  specs?: ProductSpecificationDTO[];
}

// 2. Data Transfer Object (DTO) cho thao tác Tạo mới
// Admin gửi lên cấu trúc này để hệ thống dùng Nested Writes chèn vào DB
export interface CreateProductDTO {
  categoryId: string;
  brandId: string;
  name: string;
  description: string;
  basePrice: number;
  isActive?: boolean; // Mặc định là true
  variants: Omit<ProductVariantDTO, "id">[];
  images: Omit<ProductImageDTO, "id">[];
  specs: Omit<ProductSpecificationDTO, "id">[];
}

// 3. Data Transfer Object (DTO) cho thao tác Lọc & Tìm kiếm
// Lưu ý: Dữ liệu này đã đi qua Zod (getProductsSchema) và được ép kiểu (coerce) thành Number an toàn
export interface ProductQueryDTO {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest"; // lọc theo order như giá tăng , giá giảm , mới nhất
}

// Cấu trúc phân trang trả về cho Frontend
export interface PaginatedProductResponse {
  data: ProductDTO[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
