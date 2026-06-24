import { wishlistRepository } from '../repositories/wishlist.repository';
import { WishlistInput } from '../validators/wishlist.validator';
import { WishlistDTO } from '../types/wishlist.type';
import { AppError } from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class WishlistService {
  /**
   * @description Lấy danh sách Yêu thích của bản thân
   */
  async getMyWishlist(userId: string): Promise<WishlistDTO[]> {
    return await wishlistRepository.getMyWishlist(userId);
  }

  /**
   * @description Thực hiện chức năng Toggle (Thêm/Xóa)
   */
  async toggleWishlist(userId: string, payload: WishlistInput): Promise<{ status: string, data: WishlistDTO | null }> {
    const { productId } = payload;

    // Xác minh Sản phẩm có tồn tại hay không trước khi thao tác
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new AppError(404, 'Sản phẩm không tồn tại trên hệ thống!');
    }

    return await wishlistRepository.toggleWishlist(userId, productId);
  }
}

export const wishlistService = new WishlistService();
