import { z } from 'zod';

/**
 * @description Zod Schema kiểm duyệt dữ liệu Wishlist
 */
export const wishlistSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Vui lòng cung cấp productId'),
  })
});

export type WishlistInput = z.infer<typeof wishlistSchema>['body'];
