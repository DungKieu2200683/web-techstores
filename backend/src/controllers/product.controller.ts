import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/response.util";
import { ProductQueryDTO } from "../types/product.type";

/**
 * @description Tầng Controller tiếp nhận HTTP Request cho Sản phẩm
 */
class ProductController {
  /**
   * @description Lấy danh sách sản phẩm (có hỗ trợ query)
   */
  getProducts = catchAsync(async (req: Request, res: Response) => {
    // req.query đã được Zod làm sạch và ép kiểu an toàn
    const result = await productService.getProducts(req.query as unknown as ProductQueryDTO);
    sendSuccess(res, 200, "Lấy danh sách sản phẩm thành công", result);
  });

  /**
   * @description Lấy chi tiết 1 sản phẩm bằng slug
   */
  getProductBySlug = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const product = await productService.getProductBySlug(slug);
    sendSuccess(res, 200, "Lấy chi tiết sản phẩm thành công", product);
  });

  /**
   * @description Admin tạo sản phẩm mới
   */
  createProduct = catchAsync(async (req: Request, res: Response) => {
    // req.body đã được Zod xác thực toàn bộ mảng variants, images, specs
    const newProduct = await productService.createProduct(req.body);
    sendSuccess(res, 201, "Tạo sản phẩm mới thành công", newProduct);
  });
}

export const productController = new ProductController();
