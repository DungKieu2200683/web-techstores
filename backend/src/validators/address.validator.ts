import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu Tạo/Cập nhật Địa chỉ
 */
export const addressSchema = z.object({
  body: z.object({
    street: z.string().min(5, 'Tên đường/Số nhà phải có ít nhất 5 ký tự'),
    city: z.string().min(2, 'Vui lòng nhập Tỉnh/Thành phố'),
    state: z.string().min(2, 'Vui lòng nhập Quận/Huyện'),
    zipCode: z.string().optional().nullable(),
    isDefault: z.boolean().default(false)
  })
});

export type AddressInput = z.infer<typeof addressSchema>['body'];
