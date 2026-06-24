import { Request, Response } from 'express';
import { addressService } from '../services/address.service';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response.util';

class AddressController {
  /**
   * @description Lấy danh sách địa chỉ của Khách hàng
   */
  getMyAddresses = catchAsync(async (req: Request, res: Response) => {
    const addresses = await addressService.getMyAddresses(req.user!.id);
    sendSuccess(res, 200, 'Lấy danh sách địa chỉ thành công', addresses);
  });

  /**
   * @description Thêm địa chỉ mới
   */
  createAddress = catchAsync(async (req: Request, res: Response) => {
    const address = await addressService.createAddress(req.user!.id, req.body);
    sendSuccess(res, 201, 'Đã thêm địa chỉ giao hàng', address);
  });

  /**
   * @description Cập nhật địa chỉ
   */
  updateAddress = catchAsync(async (req: Request, res: Response) => {
    const addressId = req.params.id as string;
    const address = await addressService.updateAddress(req.user!.id, addressId, req.body);
    sendSuccess(res, 200, 'Cập nhật địa chỉ thành công', address);
  });

  /**
   * @description Xóa địa chỉ
   */
  deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const addressId = req.params.id as string;
    await addressService.deleteAddress(req.user!.id, addressId);
    sendSuccess(res, 200, 'Đã xóa địa chỉ', null);
  });
}

export const addressController = new AddressController();
