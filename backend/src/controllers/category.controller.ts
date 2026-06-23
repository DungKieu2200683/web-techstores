import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/response.util";

/**
 * @description Tầng Controller tiếp nhận HTTP Request cho Danh mục (Category)
 */
class CategoryController {
  /**
   * @description Controller: Lấy danh sách tất cả danh mục sản phẩm.
   */
  getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();
    sendSuccess(res, 200, "Lấy danh sách danh mục thành công", result);
  });

  /**
   * @description Controller: Tạo danh mục mới từ dữ liệu người dùng gửi lên (req.body).
   */
  createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);
    sendSuccess(res, 201, "Tạo danh mục thành công", result);
  });
}

export const categoryController = new CategoryController();
