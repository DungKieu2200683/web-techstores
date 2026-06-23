import { z } from 'zod';

/**
 * @description Schema kiểm tra dữ liệu đầu vào khi tạo Sản phẩm mới
 * Đảm bảo Admin gửi lên đầy đủ thông tin (kể cả mảng biến thể và hình ảnh)
 */
export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Vui lòng cung cấp categoryId'),
    brandId: z.string().min(1, 'Vui lòng cung cấp brandId'),
    name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
    description: z.string().min(10, 'Mô tả quá ngắn'),
    basePrice: z.number().min(0, 'Giá gốc không được âm'),
    isActive: z.boolean().optional(),
    
    // Mảng các biến thể (Yêu cầu ít nhất 1 biến thể)
    variants: z.array(z.object({
      sku: z.string().min(1, 'SKU không được để trống'),
      name: z.string().min(1, 'Tên biến thể không được để trống'),
      price: z.number().min(0, 'Giá biến thể không được âm'),
      stock: z.number().int().min(0, 'Tồn kho không được âm')
    })).min(1, 'Sản phẩm phải có ít nhất 1 biến thể'),

    // Mảng hình ảnh (Yêu cầu ít nhất 1 ảnh)
    images: z.array(z.object({
      url: z.string().url('URL hình ảnh không hợp lệ'),
      isPrimary: z.boolean().default(false)
    })).min(1, 'Sản phẩm phải có ít nhất 1 hình ảnh'),

    // Mảng thông số kỹ thuật (Có thể rỗng)
    specs: z.array(z.object({
      name: z.string().min(1, 'Tên thông số không được để trống'),
      value: z.string().min(1, 'Giá trị thông số không được để trống')
    })).default([])
  })
});

/**
 * @description Schema kiểm tra query string khi lấy danh sách sản phẩm
 * Zod coerce sẽ tự động ép kiểu string trên URL thành number
 */
export const getProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest']).default('newest')
  })
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type GetProductsQuery = z.infer<typeof getProductsSchema>['query'];
