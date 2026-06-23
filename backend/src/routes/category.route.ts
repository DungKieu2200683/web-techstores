import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema } from '../validators/category.validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const categoryRouter = Router();

// GET /api/categories - Public
categoryRouter.get('/', categoryController.getAllCategories);

// POST /api/categories - Admin only
categoryRouter.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory
);

export default categoryRouter;
