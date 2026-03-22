import express from "express";
import { getAdminOverview, getStudentAcademicAndProject, getRecentGroups } from "../controller/AdminOverview.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.get("/overview", protect, getAdminOverview);
router.get(
  "/student/academic-project/:id", protect,
  getStudentAcademicAndProject
);
router.get("/recent-groups", protect, getRecentGroups);


export default router;
