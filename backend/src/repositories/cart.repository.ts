import { PrismaClient } from '@prisma/client';
import { CartDTO, CartItemDTO } from '../types/cart.type';

const prisma = new PrismaClient();

/**
 * @description Tầng Repository kết nối trực tiếp với CSDL cho thực thể Giỏ hàng (Cart)
 */
class CartRepository {
  /**
   * @description Lấy toàn bộ Giỏ hàng của một người dùng thông qua Prisma Nested Include.
   * 
   * CÁCH THỨC LẤY DỮ LIỆU:
   * 1. Tìm `cart` dựa vào `userId`.
   * 2. Dùng `include` móc sang bảng `items` (CartItem).
   * 3. Từ `items`, tiếp tục `include` sang `variant` (ProductVariant) để lấy Tên Biến thể, Giá tiền, và Số lượng Tồn kho.
   * 4. Từ `variant`, tiếp tục `include` sang `product` (Product) để lấy Tên gốc của Sản phẩm và Slug.
   * 5. Từ `product`, `include` lấy chính xác 1 bức ảnh đại diện (isPrimary: true) để Frontend hiển thị lên giao diện Giỏ hàng.
   * 
   * @param userId ID duy nhất của người dùng sở hữu giỏ hàng.
   * @returns {Promise<CartDTO | null>} Trả về giỏ hàng (CartDTO) với đầy đủ dữ liệu lồng nhau, hoặc `null`.
   */
  async getCartByUserId(userId: string): Promise<CartDTO | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    return cart as unknown as CartDTO | null;
  }

  /**
   * @description Lấy chi tiết 1 CartItem để kiểm tra xem nó đã tồn tại trong giỏ chưa
   * @returns {Promise<CartItemDTO | null>} Trả về sản phẩm nếu có, không có thì trả về null
   */
  async getCartItem(cartId: string, variantId: string): Promise<CartItemDTO | null> {
    const item = await prisma.cartItem.findFirst({
      where: { cartId, variantId }
    });
    return item as unknown as CartItemDTO | null;
  }

  /**
   * @description Cập nhật số lượng nếu đã tồn tại, tạo mới nếu chưa tồn tại
   * @returns {Promise<CartItemDTO>} Trả về sản phẩm vừa được cập nhật/tạo mới
   */
  async upsertCartItem(cartId: string, variantId: string, quantity: number): Promise<CartItemDTO> {
    const existingItem = await this.getCartItem(cartId, variantId);

    if (existingItem) {
      // Cập nhật
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity }
      });
      return updated as unknown as CartItemDTO;
    } else {
      // Tạo mới
      const created = await prisma.cartItem.create({
        data: {
          cartId,
          variantId,
          quantity
        }
      });
      return created as unknown as CartItemDTO;
    }
  }

  /**
   * @description Xóa 1 sản phẩm khỏi giỏ hàng
   * @returns {Promise<void>} Không trả về dữ liệu (void)
   */
  async removeCartItem(cartId: string, variantId: string): Promise<void> {
    // Xóa tất cả các item có variantId trong giỏ hàng này (Thực tế chỉ có 1)
    await prisma.cartItem.deleteMany({
      where: { cartId, variantId }
    });
  }

  /**
   * @description Xóa sạch giỏ hàng (Sau khi thanh toán xong)
   * @returns {Promise<void>} Không trả về dữ liệu (void)
   */
  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId }
    });
  }
}

export const cartRepository = new CartRepository();
