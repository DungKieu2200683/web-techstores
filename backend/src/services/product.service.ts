import { productRepository } from "../repositories/product.repository";
import {
  CreateProductInput,
} from "../validators/product.validator";
import { generateSlug } from "../utils/slugify.util";
import { AppError } from "../utils/AppError";
import { ProductDTO, PaginatedProductResponse, ProductQueryDTO } from "../types/product.type";

/**
 * @description Tầng Service xử lý logic nghiệp vụ cho Sản phẩm
 */
class ProductService {
  /**
   * @description Lấy danh sách sản phẩm
   */
  async getProducts(
    query: ProductQueryDTO,
  ): Promise<PaginatedProductResponse> {
    // 1. Gán giá trị mặc định nếu client không truyền
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sort = query.sort ?? "newest";

    // 2. Chuyển xuống Repository
    return await productRepository.getProducts({
      page,
      limit,
      search: query.search,
      categoryId: query.categoryId,
      brandId: query.brandId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort,
    });
  }

  /**
   * @description Lấy chi tiết 1 sản phẩm
   */
  async getProductBySlug(slug: string): Promise<ProductDTO> {
    const product = await productRepository.getProductBySlug(slug);

    if (!product) {
      throw new AppError(404, "Không tìm thấy sản phẩm này");
    }

    return product;
  }

  /**
   * @description Tạo sản phẩm mới
   */
  async createProduct(payload: CreateProductInput): Promise<ProductDTO> {
    // 1. Tự động sinh Slug từ Tên sản phẩm
    let slug = generateSlug(payload.name); // (Ví dụ: "iphone-15-pro-max").

    // 2. Đảm bảo Slug là duy nhất (Tránh trường hợp 2 sản phẩm trùng tên)
    const existingProduct = await productRepository.getProductBySlug(slug);
    if (existingProduct) {
      throw new AppError(400, 'Tên sản phẩm này đã được sử dụng, vui lòng chọn tên khác!');
    }

    // 3. Tiến hành lưu xuống Database
    const newProduct = await productRepository.createProduct(slug, payload);

    return newProduct;
  }
}

export const productService = new ProductService();
