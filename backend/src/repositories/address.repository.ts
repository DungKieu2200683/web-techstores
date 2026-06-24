import { PrismaClient } from "@prisma/client";
import { AddressDTO } from "../types/address.type";
import { AddressInput } from "../validators/address.validator";

const prisma = new PrismaClient();

class AddressRepository {
  /**
   * @description Lấy danh sách địa chỉ của User, đưa địa chỉ Mặc định lên đầu
   */
  async getAddressesByUserId(userId: string): Promise<AddressDTO[]> {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" }, // Đưa isDefault = true lên đầu
        { id: "desc" }, // Các địa chỉ còn lại xếp theo mới nhất
      ],
    });
    return addresses as unknown as AddressDTO[];
  }

  /**
   * @description Lấy chính xác 1 địa chỉ theo ID (Dùng cho quá trình Đặt hàng)
   */
  async getAddressById(addressId: string): Promise<AddressDTO | null> {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    return address as unknown as AddressDTO | null;
  }

  /**
   * @description Tạo địa chỉ mới. Nếu đánh dấu là Mặc định, phải gỡ Mặc định của các địa chỉ cũ (Transaction)
   */
  async createAddress(userId: string, data: AddressInput): Promise<AddressDTO> {
    if (data.isDefault) {
      // Dùng Transaction để đảm bảo tính toàn vẹn dữ liệu
      const result = await prisma.$transaction(async (tx) => {
        // 1. Gỡ cờ Mặc định của TẤT CẢ địa chỉ cũ của User này
        await tx.address.updateMany({
          where: { userId }, // lấy tất cả các address của người dùng
          data: { isDefault: false }, // set tất cả isDefault thành false
        });

        // 2. Tạo địa chỉ mới với cờ Mặc định
        return await tx.address.create({
          data: {
            userId,
            ...data,
          },
        });
      });
      return result as unknown as AddressDTO;
    } else {
      // Nếu không phải là mặc định, cứ tạo bình thường
      // Kiểm tra nếu đây là địa chỉ đầu tiên của User, tự động cho nó thành mặc định
      const count = await prisma.address.count({ where: { userId } }); // trả về số địa chỉ giao hàng
      const address = await prisma.address.create({
        data: {
          userId,
          ...data,
          isDefault: count === 0, // Tự động lên Mặc định nếu là địa chỉ đầu tiên
        },
      });
      return address as unknown as AddressDTO;
    }
  }

  /**
   * @description Cập nhật địa chỉ. Xử lý thuật toán Mặc định tương tự lúc Tạo.
   */
  async updateAddress(
    userId: string,
    addressId: string,
    data: AddressInput,
  ): Promise<AddressDTO> {
    if (data.isDefault) {
      const result = await prisma.$transaction(async (tx) => {
        // Gỡ cờ Mặc định các địa chỉ khác (Trừ địa chỉ đang được cập nhật)
        await tx.address.updateMany({
          where: { userId, id: { not: addressId } },
          data: { isDefault: false },
        });

        // Cập nhật địa chỉ hiện tại
        return await tx.address.update({
          where: { id: addressId },
          data,
        });
      });
      return result as unknown as AddressDTO;
    } else {
      // Cập nhật bình thường
      const address = await prisma.address.update({
        where: { id: addressId },
        data,
      });
      return address as unknown as AddressDTO;
    }
  }

  /**
   * @description Xóa địa chỉ
   */
  async deleteAddress(addressId: string): Promise<void> {
    await prisma.address.delete({
      where: { id: addressId },
    });
  }
}

export const addressRepository = new AddressRepository();
