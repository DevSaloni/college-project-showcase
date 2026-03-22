import express from "express";
import {
  addTeacher, getAllTeachers, getTeachersForGroup, getTeacherById, updateTeacher, deleteTeacher,
  getTeacherStudents, getTeacherStudentById, getTeacherGroups, getTeacherGroupById, getTeacherProfile
} from "../controller/TeacherController.js";
import { uploadTeachersImage } from "../middleware/teacher.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  uploadTeachersImage.single("image"),
  addTeacher
);

router.get("/profile", protect, getTeacherProfile);
router.get("/all", protect, getAllTeachers);
router.get("/dropdown", protect, getTeachersForGroup);
router.get("/students", protect, getTeacherStudents);
router.get("/groups", protect, getTeacherGroups);


router.get("/students/:id", protect, getTeacherStudentById);
router.get(
  "/groups/:id",
  protect,
  getTeacherGroupById
);

router.get("/:id", protect, getTeacherById)

router.put(
  "/update/:id",
  protect,
  uploadTeachersImage.single("image"),
  updateTeacher
);

router.delete(
  "/delete/:id",
  protect,
  deleteTeacher
);


export default router;
