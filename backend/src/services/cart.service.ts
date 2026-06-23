import { PrismaClient } from "@prisma/client";
import { cartRepository } from "../repositories/cart.repository";
import { CartItemInput } from "../validators/cart.validator";
import { AppError } from "../utils/AppError";
import { CartDTO } from "../types/cart.type";

const prisma = new PrismaClient();

/**
 * @description Tầng Service xử lý logic nghiệp vụ cho Giỏ hàng (Cart)
 */
class CartService {
  /**
   * @description Lấy giỏ hàng của người dùng và tự động tính toán động tổng số lượng sản phẩm (`totalItems`) cùng tổng thành tiền (`totalAmount`).
   * @param userId ID duy nhất của người dùng sở hữu giỏ hàng.
   * @returns Đối tượng `CartDTO` đã tích hợp thêm hai thuộc tính số liệu tổng hợp `totalItems` và `totalAmount`.
   * @throws `AppError` (404) nếu không tìm thấy giỏ hàng cho người dùng này trong hệ thống.
   */
  async getCart(userId: string): Promise<CartDTO> {
    const cart = await cartRepository.getCartByUserId(userId);

    if (!cart) {
      throw new AppError(404, "Không tìm thấy giỏ hàng cho người dùng này");
    }

    // Tính toán động Tổng số lượng và Tổng tiền
    let totalItems = 0;
    let totalAmount = 0;

    if (cart.items && cart.items.length > 0) {
      cart.items.forEach((item) => {
        totalItems += item.quantity;
        // Chú ý: variant có thể bị null nếu sản phẩm đã bị Admin xóa khỏi CSDL
        if (item.variant) {
          totalAmount += item.quantity * item.variant.price;
        }
      });
    }

    return {
      ...cart,
      totalItems,
      totalAmount,
    };
  }

  /**
   * @description Thêm sản phẩm vào giỏ hàng (Cộng dồn số lượng nếu đã có)
   */
  async addToCart(userId: string, payload: CartItemInput): Promise<void> {
    const { variantId, quantity } = payload;

    // 1. Kiểm tra tồn kho của Biến thể (Stock Validation)
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      throw new AppError(404, "Biến thể sản phẩm không tồn tại");
    }

    // 2. Lấy giỏ hàng của User
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new AppError(404, "Lỗi hệ thống: Giỏ hàng chưa được khởi tạo");
    }

    // 3. Tính toán số lượng mới (Nếu đã có trong giỏ thì cộng dồn)
    const existingItem = await cartRepository.getCartItem(cart.id, variantId);
    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // 4. So sánh với tồn kho
    if (newQuantity > variant.stock) {
      throw new AppError(
        400,
        `Rất tiếc, sản phẩm này chỉ còn ${variant.stock} chiếc trong kho`,
      );
    }

    // 5. Cập nhật vào DB
    await cartRepository.upsertCartItem(cart.id, variantId, newQuantity);
  }

  /**
   * @description Cập nhật chính xác số lượng của 1 item (Ví dụ: Từ 1 lên 5)
   */
  async updateCartItem(userId: string, payload: CartItemInput): Promise<void> {
    const { variantId, quantity } = payload;

    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) throw new AppError(404, "Không tìm thấy giỏ hàng");

    // NẾU SỐ LƯỢNG LÀ 0 -> TỰ ĐỘNG XÓA (Cải thiện UX)
    if (quantity === 0) {
      await cartRepository.removeCartItem(cart.id, variantId);
      return;
    }

    // Kiểm tra tồn kho
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) throw new AppError(404, "Biến thể sản phẩm không tồn tại");

    if (quantity > variant.stock) {
      throw new AppError(
        400,
        `Rất tiếc, sản phẩm này chỉ còn ${variant.stock} chiếc trong kho`,
      );
    }

    await cartRepository.upsertCartItem(cart.id, variantId, quantity);
  }

  /**
   * @description Xóa 1 sản phẩm khỏi giỏ hàng
   */
  async removeCartItem(userId: string, variantId: string): Promise<void> {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) throw new AppError(404, "Không tìm thấy giỏ hàng");

    await cartRepository.removeCartItem(cart.id, variantId);
  }
}

export const cartService = new CartService();
