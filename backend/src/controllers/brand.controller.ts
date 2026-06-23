import { Request, Response } from "express";
import { brandService } from "../services/brand.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/response.util";

/**
 * @description Tầng Controller tiếp nhận HTTP Request cho Thương hiệu (Brand)
 */
class BrandController {
  /**
   * @description Controller: Lấy danh sách tất cả thương hiệu sản phẩm.
   */
  getAllBrands = catchAsync(async (req: Request, res: Response) => {
    const result = await brandService.getAllBrands();
    sendSuccess(res, 200, "Lấy danh sách thương hiệu thành công", result);
  });

  /**
   * @description Controller: Tạo thương hiệu mới từ dữ liệu người dùng gửi lên (req.body).
   */
  createBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await brandService.createBrand(req.body);
    sendSuccess(res, 201, "Tạo thương hiệu thành công", result);
  });
}

export const brandController = new BrandController();
