import { Router } from 'express';
import userRouter from './user.route';
import productRouter from './product.route';
import categoryRouter from './category.route';
import brandRouter from './brand.route';
import cartRouter from './cart.route';
import orderRouter from './order.route';
import reviewRouter from './review.route';
import uploadRouter from './upload.route';
import addressRouter from './address.route';
import bannerRouter from './banner.route';

const rootRouter = Router();

/**
 * @description Tập hợp tất cả các modules vào một Router duy nhất (Root Router)
 * @business Giúp file app.ts luôn gọn gàng, không phải import hàng chục file route khác nhau.
 */

// Mount user routes
rootRouter.use('/users', userRouter);

// Mount address routes
rootRouter.use('/addresses', addressRouter);

// Mount category routes
rootRouter.use('/categories', categoryRouter);

// Mount brand routes
rootRouter.use('/brands', brandRouter);

// Mount product routes
rootRouter.use('/products', productRouter);

// Mount cart routes
rootRouter.use('/cart', cartRouter);

// Mount order routes
rootRouter.use('/orders', orderRouter);

// Mount review routes
rootRouter.use('/reviews', reviewRouter);

// Mount banner routes
rootRouter.use('/banners', bannerRouter);

// Mount upload routes
rootRouter.use('/upload', uploadRouter);

export default rootRouter;
