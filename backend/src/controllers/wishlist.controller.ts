import { Request, Response } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response.util';

class WishlistController {
  /**
   * @description Lấy danh sách Sản phẩm yêu thích (Wishlist) của User đang đăng nhập
   */
  getMyWishlist = catchAsync(async (req: Request, res: Response) => {
    const wishlists = await wishlistService.getMyWishlist(req.user!.id);
    sendSuccess(res, 200, 'Lấy danh sách yêu thích thành công', wishlists);
  });

  /**
   * @description Thêm hoặc Xóa một sản phẩm khỏi danh sách yêu thích (Toggle)
   */
  toggleWishlist = catchAsync(async (req: Request, res: Response) => {
    const result = await wishlistService.toggleWishlist(req.user!.id, req.body);
    
    if (result.status === 'added') {
      sendSuccess(res, 201, 'Đã thêm sản phẩm vào danh sách yêu thích', result.data);
    } else {
      sendSuccess(res, 200, 'Đã gỡ sản phẩm khỏi danh sách yêu thích', null);
    }
  });
}

export const wishlistController = new WishlistController();
