import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college-project-showcase/progress',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'jfif'],
  },
});

const genericStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college-project-showcase/general',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'jfif'],
  },
});

export { cloudinary, storage, genericStorage };
