import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/user.validator';

const userRouter = Router();

/**
 * @route POST /api/users/register
 * @access Public
 */
userRouter.post('/register', validate(registerSchema), userController.register);

/**
 * @route POST /api/users/login
 * @access Public
 */
userRouter.post('/login', validate(loginSchema), userController.login);

export default userRouter;
