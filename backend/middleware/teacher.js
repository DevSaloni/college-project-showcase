import multer from "multer";

import { genericStorage } from "../config/cloudinary.js";

export const uploadTeachersImage = multer({ storage: genericStorage });
