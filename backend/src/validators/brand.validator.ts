import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu khi tạo mới một Thương hiệu (Brand).
 */
export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự'),
    logoUrl: z.string().url('URL không hợp lệ').optional()
  })
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>['body'];
