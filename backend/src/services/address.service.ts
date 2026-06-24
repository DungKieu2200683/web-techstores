import { addressRepository } from "../repositories/address.repository";
import { AddressInput } from "../validators/address.validator";
import { AddressDTO } from "../types/address.type";
import { AppError } from "../utils/AppError";

class AddressService {
  /**
   * @description Lấy danh sách địa chỉ của cá nhân
   * @returns danh sách AddressDTO[]
   */
  async getMyAddresses(userId: string): Promise<AddressDTO[]> {
    return await addressRepository.getAddressesByUserId(userId);
  }

  /**
   * @description Thêm địa chỉ mới
   */
  async createAddress(userId: string, data: AddressInput): Promise<AddressDTO> {
    return await addressRepository.createAddress(userId, data);
  }

  /**
   * @description Cập nhật địa chỉ
   */
  async updateAddress(
    userId: string,
    addressId: string,
    data: AddressInput,
  ): Promise<AddressDTO> {
    // 1. Kiểm tra địa chỉ có tồn tại và thuộc về User này không
    const address = await addressRepository.getAddressById(addressId);
    if (!address) {
      throw new AppError(404, "Không tìm thấy địa chỉ");
    }
    if (address.userId !== userId) {
      throw new AppError(403, "Bạn không có quyền sửa địa chỉ này");
    }

    // 2. Tiến hành cập nhật
    return await addressRepository.updateAddress(userId, addressId, data);
  }

  /**
   * @description Xóa địa chỉ
   */
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await addressRepository.getAddressById(addressId);
    if (!address) {
      throw new AppError(404, "Không tìm thấy địa chỉ");
    }
    if (address.userId !== userId) {
      throw new AppError(403, "Bạn không có quyền xóa địa chỉ này");
    }

    await addressRepository.deleteAddress(addressId);
  }
}

export const addressService = new AddressService();
