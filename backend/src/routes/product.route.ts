import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { getProductsSchema, createProductSchema } from '../validators/product.validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const productRouter = Router();

/**
 * @route GET /api/products
 * @access Public
 */
productRouter.get('/', validate(getProductsSchema), productController.getProducts);

/**
 * @route GET /api/products/:slug
 * @access Public
 */
productRouter.get('/:slug', productController.getProductBySlug);

/**
 * @route POST /api/products
 * @access Private (Chỉ dành cho ADMIN)
 * @description API này sẽ đi qua 3 trạm gác:
 * 1. protect: Phải có Token hợp lệ
 * 2. restrictTo('ADMIN'): Token đó phải thuộc về ADMIN
 * 3. validate(createProductSchema): Dữ liệu gửi lên phải cực kỳ chuẩn chỉnh
 */
productRouter.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  validate(createProductSchema),
  productController.createProduct
);

export default productRouter;
