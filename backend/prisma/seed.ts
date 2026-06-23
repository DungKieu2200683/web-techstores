import { PrismaClient } from '@prisma/client';
import process from 'process';
import { fakerVI as faker } from '@faker-js/faker'; // Dùng tiếng Việt
import { generateSlug } from '../src/utils/slugify.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu quá trình Seeding Database...');

  // 1. Dọn dẹp Database (Tùy chọn, để không bị rác nếu chạy seed nhiều lần)
  // Xóa theo thứ tự từ con đến cha để tránh lỗi Foreign Key
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  console.log('🧹 Đã dọn dẹp dữ liệu cũ!');

  // 2. Tạo 10 Thương hiệu (Brands)
  const brandNames = ['Apple', 'Samsung', 'Dell', 'Asus', 'Sony', 'LG', 'Lenovo', 'HP', 'Acer', 'Xiaomi'];
  const createdBrands = [];

  for (const name of brandNames) {
    const brand = await prisma.brand.create({
      data: {
        name: name,
        slug: generateSlug(name),
        logoUrl: faker.image.urlPicsumPhotos({ category: 'logo' })
      }
    });
    createdBrands.push(brand);
  }
  console.log(`✅ Đã tạo ${createdBrands.length} thương hiệu.`);

  // 3. Tạo 10 Danh mục (Categories)
  const categoryNames = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Đồng hồ thông minh', 'Tai nghe', 'Loa Bluetooth', 'Màn hình', 'Bàn phím', 'Chuột máy tính', 'Phụ kiện'];
  const createdCategories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: {
        name: name,
        slug: generateSlug(name),
        description: faker.lorem.paragraph(),
        imageUrl: faker.image.urlPicsumPhotos({ category: 'technology' })
      }
    });
    createdCategories.push(category);
  }
  console.log(`✅ Đã tạo ${createdCategories.length} danh mục.`);

  // 4. Tạo 50 Sản phẩm ngẫu nhiên
  const productsCount = 50;
  for (let i = 0; i < productsCount; i++) {
    // Lấy ngẫu nhiên Category và Brand
    const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const randomBrand = createdBrands[Math.floor(Math.random() * createdBrands.length)];

    const productName = `${randomBrand.name} ${faker.commerce.productName()} ${faker.string.alphanumeric(3).toUpperCase()}`;
    const basePrice = parseFloat(faker.commerce.price({ min: 1000000, max: 50000000, dec: 0 }));

    await prisma.product.create({
      data: {
        name: productName,
        slug: `${generateSlug(productName)}-${Math.floor(Math.random() * 10000)}`, // Tránh trùng slug tuyệt đối
        description: faker.commerce.productDescription(),
        basePrice: basePrice,
        categoryId: randomCategory.id,
        brandId: randomBrand.id,
        isActive: true,
        // Dùng Nested Writes tạo luôn Variants
        variants: {
          create: [
            {
              sku: faker.string.alphanumeric(8).toUpperCase(),
              name: 'Màu Mặc định',
              price: basePrice,
              stock: faker.number.int({ min: 10, max: 100 })
            },
            {
              sku: faker.string.alphanumeric(8).toUpperCase(),
              name: 'Bản Cao cấp',
              price: basePrice + 2000000,
              stock: faker.number.int({ min: 5, max: 50 })
            }
          ]
        },
        // Dùng Nested Writes tạo Hình ảnh
        images: {
          create: [
            { url: faker.image.urlPicsumPhotos({ category: 'gadgets' }), isPrimary: true },
            { url: faker.image.urlPicsumPhotos({ category: 'electronics' }), isPrimary: false }
          ]
        },
        // Dùng Nested Writes tạo Specs
        specs: {
          create: [
            { name: 'Bảo hành', value: '12 Tháng' },
            { name: 'Tình trạng', value: 'Mới 100%' }
          ]
        }
      }
    });
  }
  
  console.log(`✅ Đã tạo ${productsCount} sản phẩm thành công.`);
  console.log('🎉 Seeding hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Có lỗi xảy ra trong quá trình Seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Ngắt kết nối DB
    await prisma.$disconnect();
  });
