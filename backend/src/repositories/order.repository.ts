import { PrismaClient } from "@prisma/client";
import { OrderDTO, OrderStatus } from "../types/order.type";

const prisma = new PrismaClient();

/**
 * @description Tầng Repository kết nối CSDL cho Đơn hàng.
 * Chứa logic quan trọng: Database Transaction để Đảm bảo Toàn vẹn Dữ liệu (Data Integrity).
 */
class OrderRepository {
  /**
   * @description Giao dịch nguyên tử (Atomic Transaction) để chốt đơn hàng.
   * Nếu có bất kỳ lỗi nào xảy ra trong quá trình thực thi (VD: lỗi mạng, sập nguồn, ...),
   * toàn bộ các thao tác thay đổi DB sẽ bị HỦY (Rollback), đảm bảo không bị trừ tiền oan hay mất hàng.
   *
   * @param userId ID người mua
   * @param shippingAddress Địa chỉ giao hàng
   * @param totalAmount Tổng tiền đã chốt
   * @param cartItems Danh sách sản phẩm trong giỏ kèm giá tại thời điểm mua
   * @param cartId ID của giỏ hàng người mua
   * @returns đổi tượng OrderDTO chữa danh sách items?: OrderItemDTO[];
   */
  async createOrderTransaction(
    userId: string,
    shippingAddress: string,
    totalAmount: number,
    cartItems: { variantId: string; quantity: number; price: number }[],
    cartId: string,
  ): Promise<OrderDTO> {
    // Khởi tạo một Transaction (tất cả các query bên trong 'tx' hoạt động như 1 khối)
    const result = await prisma.$transaction(async (tx) => {
      // Bước 1: Tạo Đơn hàng gốc (Order)
      const order = await tx.order.create({
        data: {
          userId,
          shippingAddress,
          totalAmount,
          // status và paymentStatus sẽ lấy default từ Prisma Schema (PENDING, UNPAID)
        },
      });

      // Bước 2: Tạo chi tiết đơn hàng (Order Items) & Trừ Tồn Kho
      for (const item of cartItems) {
        // Tạo OrderItem
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price, // LƯU Ý: Đây là Snapshot Price (Chốt giá)
          },
        });

        // Trừ số lượng tồn kho (Stock) của Biến thể sản phẩm
        // Dùng lệnh decrement để đảm bảo tính an toàn về dữ liệu khi có nhiều người cùng mua
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Bước 3: Làm rỗng giỏ hàng (Chỉ xóa các item đã được chốt đơn)
      await tx.cartItem.deleteMany({
        where: { cartId },
      });

      return order;
    });

    return result as unknown as OrderDTO;
  }

  /**
   * @description Lấy lịch sử mua hàng của một người dùng
   */
  async getOrdersByUserId(userId: string): Promise<OrderDTO[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders as unknown as OrderDTO[];
  }

  /**
   * @description Lấy tất cả đơn hàng (Dành cho Admin)
   */
  async getAllOrders(): Promise<OrderDTO[]> {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });
    return orders as unknown as OrderDTO[];
  }

  /**
   * @description Cập nhật trạng thái đơn hàng (Dành cho Admin)
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<OrderDTO> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return order as unknown as OrderDTO;
  }
}

export const orderRepository = new OrderRepository();
