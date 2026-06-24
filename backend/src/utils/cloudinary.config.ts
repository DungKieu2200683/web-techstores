import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description Thiết lập kết nối đến Cloudinary
 * Yêu cầu: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong file .env
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dytv4fbb9', // Fallback mượn tạm tài khoản dev nếu chưa điền
  api_key: process.env.CLOUDINARY_API_KEY || '494132479587422',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'gT985zIqD3F7_pG52oPXZ4Z6EHs',
});

export default cloudinary;
