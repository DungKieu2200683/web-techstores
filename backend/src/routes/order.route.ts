import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { checkoutSchema, updateOrderStatusSchema } from '../validators/order.validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const orderRouter = Router();

// ==========================================
// API DÀNH CHO KHÁCH HÀNG (YÊU CẦU LOGIN)
// ==========================================

// GET /api/orders/my-orders -> Lịch sử mua hàng cá nhân
orderRouter.get('/my-orders', protect, orderController.getMyOrders);

// POST /api/orders/checkout -> Khách hàng thực hiện Đặt hàng
orderRouter.post('/checkout', protect, validate(checkoutSchema), orderController.checkout);


// ==========================================
// API DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
// ==========================================

// GET /api/orders -> Admin lấy danh sách toàn bộ đơn hàng
orderRouter.get('/', protect, restrictTo('ADMIN'), orderController.getAllOrders);

// PUT /api/orders/:id/status -> Admin cập nhật trạng thái đơn hàng
orderRouter.put('/:id/status', protect, restrictTo('ADMIN'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default orderRouter;
