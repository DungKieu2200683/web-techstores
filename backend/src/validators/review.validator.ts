import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu khi khách hàng gửi đánh giá sản phẩm.
 * Chặn các trường hợp vote 0 sao, 6 sao, hoặc comment quá dài mang tính chất spam.
 */
export const reviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Vui lòng cung cấp productId'),
    rating: z.number().int().min(1, 'Đánh giá thấp nhất là 1 sao').max(5, 'Đánh giá cao nhất là 5 sao'),
    comment: z.string().max(500, 'Bình luận không được vượt quá 500 ký tự').optional().nullable()
  })
});

export type ReviewInput = z.infer<typeof reviewSchema>['body'];
