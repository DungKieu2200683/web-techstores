import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu khi tạo mới một Danh mục (Category).
 * Chặn các dữ liệu rác, tên quá ngắn hoặc URL không hợp lệ.
 */
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
    description: z.string().optional(),
    imageUrl: z.string().url('URL không hợp lệ').optional(),
    parentId: z.string().optional()
  })
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
