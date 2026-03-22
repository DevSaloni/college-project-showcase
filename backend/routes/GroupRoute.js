import express from "express";
import { createGroup, getAllGroups, getGroupsById ,getMentorGroupsWithStudents,getGroupByStudent} from "../controller/GroupController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createGroup);
router.get("/all", protect, getAllGroups);
router.get("/student",protect, getGroupByStudent);
 
router.get("/:id", protect, getGroupsById);


router.get(
  "/mentor/:mentorId",
  protect,
  getMentorGroupsWithStudents
);

export default router;
