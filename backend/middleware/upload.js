import multer from "multer";
import { genericStorage } from "../config/cloudinary.js";

export const upload = multer({ storage: genericStorage });
