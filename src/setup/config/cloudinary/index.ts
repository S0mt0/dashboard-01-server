import { v2 as cloudinary } from "cloudinary";

/**
 * Configure cloudinary SDK with credentials
 * @returns Cloudinary configuration
 */
const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export { cloudinary };

export default cloudinaryConfig;
