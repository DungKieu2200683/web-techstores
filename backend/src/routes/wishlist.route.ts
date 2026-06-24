import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { validate } from '../middlewares/validate.middleware';
import { wishlistSchema } from '../validators/wishlist.validator';
import { protect } from '../middlewares/auth.middleware';

const wishlistRouter = Router();

// ==========================================
// TẤT CẢ API WISHLIST ĐỀU YÊU CẦU ĐĂNG NHẬP
// ==========================================
wishlistRouter.use(protect);

// Lấy danh sách Wishlist của Khách hàng đang đăng nhập
wishlistRouter.get('/', wishlistController.getMyWishlist);

// Bật/Tắt (Toggle) một sản phẩm trong Wishlist
wishlistRouter.post('/toggle', validate(wishlistSchema), wishlistController.toggleWishlist);

export default wishlistRouter;
