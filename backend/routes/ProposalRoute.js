import express from "express";
import {
  createProposal,
  getWorkspaceData,
  updateProposalStatus,
  getProposalByGroup,
  updateProposal
} from "../controller/ProposalController.js";
import { protect,teacherOnly } from "../middleware/auth.js";

const router = express.Router();

/* STUDENT */
router.post("/create",protect, createProposal);

/* TEACHER */
router.get("/:groupId/workspace", protect,getWorkspaceData);

router.put("/update/:id", protect,teacherOnly, updateProposalStatus);
router.get("/group/:groupId", protect, getProposalByGroup);
router.put("/update/:proposalId", protect, updateProposal);


export default router;
