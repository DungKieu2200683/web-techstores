import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu Tạo/Cập nhật Banner
 */
export const bannerSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Tiêu đề Banner phải có ít nhất 3 ký tự'),
    imageUrl: z.string().url('Đường dẫn hình ảnh không hợp lệ (Phải là URL từ Cloudinary)'),
    linkUrl: z.string().url('Đường dẫn liên kết không hợp lệ').optional().nullable(),
    isActive: z.boolean().default(true)
  })
});

export type BannerInput = z.infer<typeof bannerSchema>['body'];
