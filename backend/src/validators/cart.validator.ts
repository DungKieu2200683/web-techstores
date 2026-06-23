import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu khi Khách hàng thêm/sửa Giỏ hàng
 * Ngăn chặn tuyệt đối việc truyền số lượng âm (VD: hack giảm tiền giỏ hàng)
 */
export const cartItemSchema = z.object({
  body: z.object({
    variantId: z.string().min(1, 'Vui lòng cung cấp variantId'),
    quantity: z.number().int().min(0, 'Số lượng không được âm')
  })
});

export type CartItemInput = z.infer<typeof cartItemSchema>['body'];
