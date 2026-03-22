import express from "express";
import {
  submitProgress,
  reviewMilestone,
  getCurrentProgress,
  getMentorSubmissions,
  getSingleSubmission,
  
} from "../controller/ProjectProgressController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();

router.get("/current", protect,getCurrentProgress);

router.get("/reviews", protect, getMentorSubmissions);

router.get(
  "/reviews/:progressId/:milestoneId",
  protect,
  getSingleSubmission
);

router.post("/review", protect, reviewMilestone);

router.post(
  "/submit",
  protect,                
  upload.array("files",5), 
  submitProgress           
);


export default router;
