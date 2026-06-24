import { orderRepository } from '../repositories/order.repository';
import { cartRepository } from '../repositories/cart.repository';
import { CheckoutInput } from '../validators/order.validator';
import { AppError } from '../utils/AppError';
import { OrderDTO, OrderStatus } from '../types/order.type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @description Tầng Service xử lý logic nghiệp vụ cho Đơn hàng
 */
class OrderService {
  /**
   * @description Thực hiện quá trình Thanh toán (Checkout) từ Giỏ hàng sang Đơn hàng
   */
  async checkout(userId: string, payload: CheckoutInput): Promise<OrderDTO> {
    const { shippingAddress } = payload;

    // 1. Kéo toàn bộ Giỏ hàng của Khách về
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new AppError(404, 'Không tìm thấy giỏ hàng của bạn');
    }

    if (!cart.items || cart.items.length === 0) {
      throw new AppError(400, 'Giỏ hàng đang trống, không thể đặt hàng!');
    }

    // 2. Kiểm tra tồn kho lần cuối & Tính toán Tổng tiền
    let totalAmount = 0;
    const checkoutItems = [];

    // Mở vòng lặp kiểm tra từng món hàng trong giỏ
    for (const item of cart.items) {
      // Vì Variant có thể đã bị Admin xóa, cần check kỹ
      if (!item.variant) {
        throw new AppError(400, `Một sản phẩm trong giỏ của bạn không còn tồn tại trên hệ thống`);
      }

      // Query trực tiếp DB lần cuối cùng để lấy Stock mới nhất 
      // (Đề phòng lúc khách để trong giỏ thì còn, lúc bấm thanh toán thì người khác mua mất)
      const latestVariant = await prisma.productVariant.findUnique({ where: { id: item.variant.id } });
      
      if (!latestVariant) {
         throw new AppError(400, `Biến thể ${item.variant.name} không còn tồn tại`);
      }

      if (latestVariant.stock < item.quantity) {
        throw new AppError(400, `Rất tiếc, sản phẩm ${item.variant.name} hiện chỉ còn ${latestVariant.stock} chiếc trong kho!`);
      }

      // Tính tổng tiền dựa trên giá mới nhất từ DB (Chống Hack sửa giá ở Frontend)
      totalAmount += latestVariant.price * item.quantity;
      
      // Đưa vào mảng dữ liệu chuẩn bị nạp vào Transaction
      checkoutItems.push({
        variantId: latestVariant.id,
        quantity: item.quantity,
        price: latestVariant.price // Chốt giá tại đây (Snapshot)
      });
    }

    // 3. Tiến hành Transaction Giao dịch Nguyên tử
    // Gọi thẳng vào Repository để khóa DB và chốt đơn
    return await orderRepository.createOrderTransaction(
      userId,
      shippingAddress,
      totalAmount,
      checkoutItems,
      cart.id
    );
  }

  /**
   * @description Lấy lịch sử mua hàng của cá nhân
   */
  async getMyOrders(userId: string): Promise<OrderDTO[]> {
    return await orderRepository.getOrdersByUserId(userId);
  }

  /**
   * @description Lấy toàn bộ đơn hàng của hệ thống (Dành cho Admin)
   */
  async getAllOrders(): Promise<OrderDTO[]> {
    return await orderRepository.getAllOrders();
  }

  /**
   * @description Cập nhật trạng thái giao hàng (Dành cho Admin)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDTO> {
    return await orderRepository.updateOrderStatus(orderId, status);
  }
}

export const orderService = new OrderService();
