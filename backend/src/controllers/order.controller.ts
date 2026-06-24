import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/response.util";

class OrderController {
  /**
   * @description Khách hàng thực hiện Đặt hàng (Checkout)
   */
  checkout = catchAsync(async (req: Request, res: Response) => {
    // req.user.id được lấy tự động từ Token
    const order = await orderService.checkout(req.user!.id, req.body); // ! để cho TypeScript tin rằng req.user có dữ liệu trong đó
    sendSuccess(res, 201, "Đặt hàng thành công!", order);
  });

  /**
   * @description Lấy danh sách lịch sử mua hàng của Khách hàng
   */
  getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await orderService.getMyOrders(req.user!.id);
    sendSuccess(res, 200, "Lấy lịch sử đơn hàng thành công", orders);
  });

  /**
   * @description Admin lấy toàn bộ đơn hàng trong hệ thống
   */
  getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await orderService.getAllOrders();
    sendSuccess(res, 200, "Lấy tất cả đơn hàng thành công", orders);
  });

  /**
   * @description Admin cập nhật trạng thái đơn hàng (VD: SHIPPED, DELIVERED)
   */
  updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status);
    sendSuccess(res, 200, "Cập nhật trạng thái đơn hàng thành công", order);
  });
}

export const orderController = new OrderController();
