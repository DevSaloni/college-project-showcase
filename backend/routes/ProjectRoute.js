import express from "express";
import { createProject, getProjectById, getProjectByStudentId, getAllProjects, getMyProjectsByStatus, addRating, addComment, bookmarkProject, getProjectsByCategory, updateProject } from "../controller/ProjectController.js";
import { upload } from "../middleware/upload.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "documentation", maxCount: 1 },
  ]),
  createProject
);

router.get("/all", getAllProjects);

router.get("/my-projects/status", protect, getMyProjectsByStatus);

router.get("/student/:id", protect, getProjectByStudentId);

router.get("/category/:slug", getProjectsByCategory);

router.get("/:id", optionalAuth, getProjectById);

router.put("/update/:id", protect, updateProject);

router.post("/:id/rating", protect, addRating);
router.post("/:id/comment", protect, addComment);
router.post("/:id/bookmark", protect, bookmarkProject);


export default router;