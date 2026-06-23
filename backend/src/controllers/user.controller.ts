import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response.util';
import { catchAsync } from '../utils/catchAsync';

/**
 * @description Controller quản lý các yêu cầu HTTP liên quan đến User
 */
class UserController {
  /**
   * @description Xử lý API đăng ký tài khoản mới (Đã loại bỏ try...catch nhờ catchAsync)
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;
    const data = await userService.registerUser({ email, password, fullName });
    sendSuccess(res, 201, 'Đăng ký tài khoản thành công', data);
  });

  /**
   * @description Xử lý API đăng nhập
   */
  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await userService.loginUser({ email, password });
    sendSuccess(res, 200, 'Đăng nhập thành công', data);
  });
}

export const userController = new UserController();
