/**
 * @description Định nghĩa các kiểu dữ liệu DTO cho Module Giỏ hàng
 */

export interface CartItemDTO {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;

  // Dữ liệu mở rộng từ Variant và Product (để Frontend hiển thị dễ dàng)
  variant?: {
    id: string;
    sku: string;
    name: string; // VD: "Màu đỏ - 128GB"
    price: number;
    stock: number;
    product: {
      id: string;
      name: string; // VD: "iPhone 15 Pro"
      slug: string;
      images: { url: string; isPrimary: boolean }[];
    };
  };
}
// lấy danh sách giỏ hàng của user
export interface CartDTO {
  id: string;
  userId: string;
  updatedAt: Date;
  items: CartItemDTO[];

  // Dữ liệu được tính toán động (Dynamic calculation) ở tầng Service
  totalItems: number; // tổng item trong giỏ hàng
  totalAmount: number; // tổng tiền trong giỏ hàng
}
