import { PrismaClient, Prisma } from "@prisma/client";
import {
  CreateProductDTO,
  ProductDTO,
  PaginatedProductResponse,
  ProductQueryDTO,
} from "../types/product.type";

const prisma = new PrismaClient();

class ProductRepository {
  /**
   * @description Lấy danh sách sản phẩm với Truy vấn động (Dynamic Query)
   * Đây là một trong những hàm khó nhất của hệ thống vì nó phải ghép nối hàng loạt điều kiện từ URL.
   */
  async getProducts(params: ProductQueryDTO): Promise<PaginatedProductResponse> {
    const {
      page,
      limit,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      sort,
    } = params;

    // 1. Dựng điều kiện WHERE động
    const where: Prisma.ProductWhereInput = {
      isActive: true, // Mặc định chỉ hiển thị sản phẩm đang bán
    };

    if (search) {
      // Tìm kiếm tương đối (LIKE) không phân biệt hoa thường bằng cách chuyển tất cả về lowercase (Prisma postgresql default is case sensitive, so use mode: 'insensitive')
      // Wait, let's use Prisma's `contains` with `mode: 'insensitive'` so sánh thông minh "Apple" hay "apple"
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    // 2. Dựng điều kiện ORDER BY
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sort === "price_asc") orderBy = { basePrice: "asc" };
    else if (sort === "price_desc") orderBy = { basePrice: "desc" };
    else orderBy = { createdAt: "desc" }; // newest

    // 3. Tính toán Phân trang (Pagination)
    const skip = (page - 1) * limit;

    // 4. Chạy 2 câu truy vấn song song để tăng tốc độ
    const [totalRecords, products] = await Promise.all([
      prisma.product.count({ where }), // Đếm tổng số lượng thỏa điều kiện
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        // Lấy thêm 1 ảnh đại diện để hiển thị trên danh sách
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
        },
      }),
    ]);

    return {
      data: products as unknown as ProductDTO[],
      pagination: {
        page, // trang hiện tại
        limit, // số sản phẩm được hiển thị trên trang
        totalRecords, // số sản phẩm thỏa mãn điều kiện lọc
        totalPages: Math.ceil(totalRecords / limit), // tính số trang hiển thị
      },
    };
  }

  /**
   * @description Lấy chi tiết một sản phẩm dựa trên đường dẫn thân thiện (Slug).
   * @business Thường dùng cho trang Chi tiết sản phẩm (Product Detail Page) ở Frontend,
   * nơi cần hiển thị đầy đủ thông tin kỹ thuật, hình ảnh và các phiên bản cấu hình khác nhau.
   * * @param slug - Chuỗi định danh duy nhất của sản phẩm trên URL (Ví dụ: "iphone-15-pro-max").
   * @returns Trả về `ProductDTO` chứa đầy đủ cấu trúc con nếu tìm thấy, hoặc `null` nếu sản phẩm không tồn tại.
   */
  async getProductBySlug(slug: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        variants: true,
        specs: true,
        category: true,
        brand: true,
      },
    });

    return product as unknown as ProductDTO | null;
  }

  /**
   * @description Tạo sản phẩm mới sử dụng Nested Writes của Prisma
   * @business Đảm bảo tính Toàn vẹn dữ liệu (ACID). Nếu tạo hình ảnh bị lỗi, sản phẩm cũng không được tạo.
   * @param slug - Chuỗi URL thân thiện độc nhất của sản phẩm (được tạo tự động từ tên sản phẩm ở tầng trước).
   * @param data - Đối tượng chứa toàn bộ thông tin sản phẩm và mảng dữ liệu con cần tạo (`CreateProductDTO`).(Ví dụ: "iphone-15-pro-max").
   * @returns Trả về `ProductDTO` chứa thông tin chi tiết của sản phẩm vừa tạo thành công kèm đầy đủ mảng quan hệ con.
   */
  async createProduct(
    slug: string,
    data: CreateProductDTO,
  ): Promise<ProductDTO> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        brandId: data.brandId,
        isActive: data.isActive,
        // Tạo các biến thể cùng lúc
        variants: {
          create: data.variants,
        },
        // Tạo các hình ảnh cùng lúc
        images: {
          create: data.images,
        },
        // Tạo cấu hình cùng lúc
        specs: {
          create: data.specs,
        },
      },
      // Sau khi tạo xong, lấy luôn toàn bộ dữ liệu vừa tạo ra để trả về
      include: {
        variants: true,
        images: true,
        specs: true,
      },
    });

    return product as unknown as ProductDTO;
  }
}

export const productRepository = new ProductRepository();
