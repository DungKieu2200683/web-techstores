import { PrismaClient } from '@prisma/client';
import { WishlistDTO } from '../types/wishlist.type';

const prisma = new PrismaClient();

class WishlistRepository {
  /**
   * @description Lấy danh sách sản phẩm yêu thích của User
   * Bao gồm thông tin cơ bản của Sản phẩm để hiển thị trên UI
   */
  async getMyWishlist(userId: string): Promise<WishlistDTO[]> {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return wishlists as unknown as WishlistDTO[];
  }

  /**
   * @description Thuật toán Toggle: Nếu có rồi thì Xóa, nếu chưa có thì Thêm
   */
  async toggleWishlist(userId: string, productId: string): Promise<{ status: 'added' | 'removed', data: WishlistDTO | null }> {
    // 1. Kiểm tra xem sản phẩm đã có trong Wishlist chưa
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      // Đã có -> Thực hiện Xóa khỏi danh sách yêu thích
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return { status: 'removed', data: null };
    } else {
      // Chưa có -> Thực hiện Thêm vào danh sách yêu thích
      const newItem = await prisma.wishlist.create({
        data: { userId, productId }
      });
      return { status: 'added', data: newItem as unknown as WishlistDTO };
    }
  }
}

export const wishlistRepository = new WishlistRepository();
