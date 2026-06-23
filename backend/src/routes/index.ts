import { Router } from 'express';
import userRouter from './user.route';
import productRouter from './product.route';
import categoryRouter from './category.route';
import brandRouter from './brand.route';
import cartRouter from './cart.route';

const rootRouter = Router();

/**
 * @description Tập hợp tất cả các modules vào một Router duy nhất (Root Router)
 * @business Giúp file app.ts luôn gọn gàng, không phải import hàng chục file route khác nhau.
 */

// Mount user routes
rootRouter.use('/users', userRouter);

// Mount category routes
rootRouter.use('/categories', categoryRouter);

// Mount brand routes
rootRouter.use('/brands', brandRouter);

// Mount product routes
rootRouter.use('/products', productRouter);

// Mount cart routes
rootRouter.use('/cart', cartRouter);

export default rootRouter;
