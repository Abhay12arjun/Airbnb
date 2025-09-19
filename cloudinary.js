import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import dotenv from "dotenv";

dotenv.config();

// Cloudinary account credentials (use .env file for safety)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings",        // folder name in Cloudinary
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

export { cloudinary, storage };
