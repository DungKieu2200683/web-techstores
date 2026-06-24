import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu khi khách hàng đặt hàng (Checkout).
 * Dữ liệu cần thiết duy nhất là Địa chỉ giao hàng. Các thông tin về sản phẩm, số lượng, giá được tính toán từ Giỏ hàng ở Backend để tránh việc khách hàng hack giá tiền.
 */
export const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().min(1, 'Vui lòng cung cấp ID địa chỉ giao hàng'),
  })
});

export type CheckoutInput = z.infer<typeof checkoutSchema>['body'];

/**
 * @description Zod Schema cho Admin cập nhật trạng thái đơn hàng
 */
export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  })
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>['body'];
