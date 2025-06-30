import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (base64, folder = 'contractors') => {
  try {
    const res = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: 'auto',
    });
    return {
      url: res.secure_url,
      type: res.resource_type,
      name: res.original_filename,
    };
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

export default cloudinary;
