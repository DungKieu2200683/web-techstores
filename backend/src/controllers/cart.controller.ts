import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response.util';

/**
 * @description Tầng Controller tiếp nhận HTTP Request cho Giỏ hàng
 * Chú ý: Tất cả API ở đây đều phải đi qua Middleware `protect` nên chắc chắn có `req.user`
 */
class CartController {
  /**
   * @description Lấy giỏ hàng của chính mình
   */
  getCart = catchAsync(async (req: Request, res: Response) => {
    // req.user.id được lấy từ Token, đảm bảo tính bảo mật
    const cart = await cartService.getCart(req.user!.id);
    sendSuccess(res, 200, 'Lấy giỏ hàng thành công', cart);
  });

  /**
   * @description Thêm sản phẩm vào giỏ (Cộng dồn nếu đã có)
   */
  addToCart = catchAsync(async (req: Request, res: Response) => {
    await cartService.addToCart(req.user!.id, req.body);
    sendSuccess(res, 200, 'Đã thêm sản phẩm vào giỏ hàng', null);
  });

  /**
   * @description Cập nhật số lượng của 1 sản phẩm
   */
  updateCartItem = catchAsync(async (req: Request, res: Response) => {
    // req.body đã chứa sẵn { variantId, quantity }
    await cartService.updateCartItem(req.user!.id, req.body);
    sendSuccess(res, 200, 'Đã cập nhật số lượng', null);
  });

  /**
   * @description Xóa 1 sản phẩm khỏi giỏ hàng
   */
  removeCartItem = catchAsync(async (req: Request, res: Response) => {
    const variantId = req.params.variantId as string;
    await cartService.removeCartItem(req.user!.id, variantId);
    sendSuccess(res, 200, 'Đã xóa sản phẩm khỏi giỏ hàng', null);
  });
}

export const cartController = new CartController();
