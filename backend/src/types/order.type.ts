/**
 * @description Định nghĩa kiểu dữ liệu DTO cho Module Đơn hàng (Order)
 */

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface OrderItemDTO {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number; // Giá chốt tại thời điểm mua hàng
  
  // Thông tin mở rộng (Nếu có include variant để hiển thị)
  variant?: {
    id: string;
    sku: string;
    name: string;
    product: {
      name: string;
      slug: string;
      images: { url: string; isPrimary: boolean }[];
    }
  }
}

export interface OrderDTO {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  
  items?: OrderItemDTO[];
}
