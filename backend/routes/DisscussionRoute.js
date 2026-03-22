import express from "express";
import {
  sendMessage,
  getGroupDiscussion,
  editMessage,
  deleteMessage,
  markMessagesAsRead
} from "../controller/DiscussionController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js"; // Import upload middleware

const router = express.Router();

// Allow single file upload under 'attachment' key
router.post("/:groupId", protect, upload.single("attachment"), sendMessage);
router.get("/:groupId", protect, getGroupDiscussion);

// New advanced features
router.put("/:id/edit", protect, editMessage);
router.delete("/:id/delete", protect, deleteMessage);
router.post("/:groupId/read", protect, markMessagesAsRead);

export default router;
