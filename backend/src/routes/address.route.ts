import { Router } from "express";
import { addressController } from "../controllers/address.controller";
import { validate } from "../middlewares/validate.middleware";
import { addressSchema } from "../validators/address.validator";
import { protect } from "../middlewares/auth.middleware";

const addressRouter = Router();

// Toàn bộ API Địa chỉ đều yêu cầu Đăng nhập
addressRouter.use(protect);

// Lấy danh sách địa chỉ
addressRouter.get("/", addressController.getMyAddresses);

// Thêm địa chỉ mới
addressRouter.post(
  "/",
  validate(addressSchema),
  addressController.createAddress,
);

// Sửa địa chỉ
addressRouter.put(
  "/:id",
  validate(addressSchema),
  addressController.updateAddress,
);

// Xóa địa chỉ
addressRouter.delete("/:id", addressController.deleteAddress);

export default addressRouter;
