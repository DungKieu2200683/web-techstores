import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { validate } from '../middlewares/validate.middleware';
import { cartItemSchema } from '../validators/cart.validator';
import { protect } from '../middlewares/auth.middleware';

const cartRouter = Router();

// ==========================================
// BẢO MẬT: TOÀN BỘ API GIỎ HÀNG ĐỀU YÊU CẦU LOGIN
// ==========================================
cartRouter.use(protect); // Áp dụng bảo vệ cho tất cả các route bên dưới

// GET /api/cart -> Lấy giỏ hàng của chính mình
cartRouter.get('/', cartController.getCart);

// POST /api/cart/items -> Thêm mới 1 sản phẩm vào giỏ
cartRouter.post('/items', validate(cartItemSchema), cartController.addToCart);

// PUT /api/cart/items -> Cập nhật số lượng (Dữ liệu truyền trong Body)
cartRouter.put('/items', validate(cartItemSchema), cartController.updateCartItem);

// DELETE /api/cart/items/:variantId -> Xóa khỏi giỏ
cartRouter.delete('/items/:variantId', cartController.removeCartItem);

export default cartRouter;
