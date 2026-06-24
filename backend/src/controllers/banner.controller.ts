import { Request, Response } from 'express';
import { bannerService } from '../services/banner.service';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response.util';

class BannerController {
  /**
   * @description Lấy danh sách Banners đang hoạt động (Public)
   */
  getActiveBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await bannerService.getActiveBanners();
    sendSuccess(res, 200, 'Lấy danh sách Banner thành công', banners);
  });

  /**
   * @description Lấy toàn bộ Banners (Admin)
   */
  getAllBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await bannerService.getAllBanners();
    sendSuccess(res, 200, 'Lấy danh sách quản lý Banner thành công', banners);
  });

  /**
   * @description Thêm Banner mới (Admin)
   */
  createBanner = catchAsync(async (req: Request, res: Response) => {
    const banner = await bannerService.createBanner(req.body);
    sendSuccess(res, 201, 'Đã thêm Banner mới', banner);
  });

  /**
   * @description Cập nhật Banner (Admin)
   */
  updateBanner = catchAsync(async (req: Request, res: Response) => {
    const banner = await bannerService.updateBanner(req.params.id as string, req.body);
    sendSuccess(res, 200, 'Cập nhật Banner thành công', banner);
  });

  /**
   * @description Xóa Banner (Admin)
   */
  deleteBanner = catchAsync(async (req: Request, res: Response) => {
    await bannerService.deleteBanner(req.params.id as string);
    sendSuccess(res, 200, 'Đã xóa Banner', null);
  });
}

export const bannerController = new BannerController();
