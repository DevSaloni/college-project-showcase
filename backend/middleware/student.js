import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/students",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadStudentImage = multer({ storage });
