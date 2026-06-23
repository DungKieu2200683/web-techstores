import slugify from 'slugify';

/**
 * @description Hàm tiện ích tạo đường dẫn thân thiện (Slug) từ chuỗi văn bản.
 * Dùng chung cho toàn hệ thống (Sản phẩm, Danh mục, Thương hiệu, Bài viết...)
 * @param text Chuỗi văn bản gốc (VD: "Điện thoại iPhone 15 Pro Max")
 * @returns Chuỗi slug đã được chuẩn hóa (VD: "dien-thoai-iphone-15-pro-max")
 */
export const generateSlug = (text: string): string => {
  return slugify(text, {
    replacement: '-',  // Ký tự thay thế khoảng trắng
    remove: undefined, // Xóa bỏ các ký tự đặc biệt nếu cần (có thể dùng Regex: /[*+~.()'"!:@]/g)
    lower: true,       // Chuyển toàn bộ thành chữ thường
    strict: true,      // Cắt bỏ toàn bộ các ký tự không an toàn cho URL
    locale: 'vi',      // Hỗ trợ tiếng Việt (Bỏ dấu)
    trim: true         // Xóa khoảng trắng ở đầu và cuối
  });
};
