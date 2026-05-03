import multer from "multer";

import { genericStorage } from "../config/cloudinary.js";

export const uploadStudentImage = multer({ storage: genericStorage });
