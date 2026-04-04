import express from "express";
import {
  addStudentByAdmin,
  getAllStudents,
  getStudentsForGroup,
  getMyAcademicProjects,
  getStudentById,
  getProjectDetails,
  updateStudent,
  deleteStudent,
  getStudentProfile,
} from "../controller/StudentController.js";

import { uploadStudentImage } from "../middleware/student.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/add",
  uploadStudentImage.single("image"),
  addStudentByAdmin
);

router.get("/profile", protect, getStudentProfile);
router.get("/all", protect, getAllStudents);
router.get("/dropdown", protect, getStudentsForGroup);
router.get("/my-academic-projects", protect, getMyAcademicProjects);

router.get("/:id", optionalAuth, getStudentById);
router.get("/project-details/:id", protect, getProjectDetails);

router.put(
  "/update/:id",
  protect,
  uploadStudentImage.single("image"),
  updateStudent
);

router.delete("/delete/:id", protect, deleteStudent);

export default router;
