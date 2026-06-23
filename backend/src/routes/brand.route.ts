import { Router } from 'express';
import { brandController } from '../controllers/brand.controller';
import { validate } from '../middlewares/validate.middleware';
import { createBrandSchema } from '../validators/brand.validator';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const brandRouter = Router();

// GET /api/brands - Public
brandRouter.get('/', brandController.getAllBrands);

// POST /api/brands - Admin only
brandRouter.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  validate(createBrandSchema),
  brandController.createBrand
);

export default brandRouter;
