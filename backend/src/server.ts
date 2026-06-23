import app from './app';

/**
 * @description Lấy cổng (Port) từ biến môi trường. Nếu không có cấu hình thì mặc định dùng cổng 5000.
 */
const PORT = process.env.PORT || 5000;

/**
 * @description Hàm khởi động toàn bộ Server.
 * @business Nơi hệ thống bắt đầu "sống" và lắng nghe các tương tác của khách hàng.
 */
const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Backend TechStore is running on http://localhost:${PORT}`);
      console.log(`⏱️ Thời gian khởi động: ${new Date().toLocaleString('vi-VN')}`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động Server:', error);
    process.exit(1); // Tắt tiến trình Node.js nếu có lỗi nghiêm trọng
  }
};

startServer();
