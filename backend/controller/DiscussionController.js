import mongoose from "mongoose";
import Group from "../models/Groups.js";
import Discussion from "../models/Discussion.js";
import { io } from "../index.js";
import { createNotification } from "./NotificationController.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import ProjectProgress from "../models/ProjectProgress.js";

/* ================= SEND MESSAGE ================= */
export const sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message, context } = req.body;
    const file = req.file;

    if ((!message || message.trim() === "") && !file) {
      return res.status(400).json({ message: "Message or file is required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const senderRole =
      req.user.role === "teacher" ? "teacher" : "student";

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (file) {
      // Assuming frontend can access /uploads/...
      // the multer destination is "uploads/" 
      fileUrl = `/uploads/${file.filename}`;
      fileName = file.originalname;
      fileType = file.mimetype;
    }

    // save message in database
    const discussion = await Discussion.create({
      group: groupId,
      context: context || "proposal",
      message: message || "",
      sender: req.user._id,
      senderRole,
      fileUrl,
      fileName,
      fileType,
    });

    // populate sender info
    const populatedMessage = await discussion.populate(
      "sender",
      "name email"
    );

    // emit message to socket room (include context for frontend filtering)
    io.to(groupId).emit("receiveMessage", { ...populatedMessage.toObject(), context: discussion.context });

    res.status(201).json({
      message: populatedMessage,
    });

    // --- NOTIFICATION LOGIC ---
    const senderName = req.user.name || "A member";
    const studentLink = discussion.context === "progress" 
      ? "/student-dashboard/project-progress?tab=discussion" 
      : "/student-dashboard/proposal?tab=discussion";

    // 1. Notify Mentor
    const mentor = await Teacher.findById(group.mentor);
    if (mentor && mentor.userId.toString() !== req.user._id.toString()) {
      let mentorLink = `/teacher-dashboard/groups/${groupId}?tab=discussion`;
      
      if (discussion.context === "progress") {
        try {
          const progressInfo = await ProjectProgress.findOne({ groupId }).sort({ createdAt: -1 });
          if (progressInfo && progressInfo.milestones && progressInfo.milestones.length > 0) {
            // Focus on the most recently added milestone
            const latestMilestone = progressInfo.milestones[progressInfo.milestones.length - 1];
            mentorLink = `/teacher-dashboard/reviews/${progressInfo._id}/${latestMilestone._id}?tab=discussion`;
          } else {
            mentorLink = `/teacher-dashboard/reviews`;
          }
        } catch (linkErr) {
          console.error("Error generating mentor link:", linkErr);
          mentorLink = `/teacher-dashboard/reviews`;
        }
      }

      await createNotification({
        recipient: mentor.userId,
        sender: req.user._id,
        type: "message",
        title: `New Message in ${group.groupName}`,
        message: `${senderName}: ${message ? (message.length > 50 ? message.substring(0, 47) + "..." : message) : "Sent an attachment"}`,
        link: mentorLink,
        metadata: { groupId, context: discussion.context }
      });
    }

    // 2. Notify Students
    const students = await Student.find({ _id: { $in: group.students } });
    for (const student of students) {
      if (student.userId.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: student.userId,
          sender: req.user._id,
          type: "message",
          title: `New Message in ${group.groupName}`,
          message: `${senderName}: ${message ? (message.length > 50 ? message.substring(0, 47) + "..." : message) : "Sent an attachment"}`,
          link: studentLink,
          metadata: { groupId, context: discussion.context }
        });
      }
    }

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET GROUP DISCUSSION ================= */
export const getGroupDiscussion = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }
    const { context } = req.query; // get context from query e.g. ?context=progress

    const query = { group: groupId };
    if (context) query.context = context;

    const discussions = await Discussion.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages: discussions,
    });

  } catch (error) {
    console.error("Get discussion error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EDIT MESSAGE ================= */
export const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: "Message not found" });

    if (discussion.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this message" });
    }

    discussion.message = message;
    discussion.isEdited = true;
    await discussion.save();

    const populatedMessage = await discussion.populate("sender", "name email");

    io.to(discussion.group.toString()).emit("messageUpdated", populatedMessage);

    res.status(200).json({ message: populatedMessage });
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE MESSAGE ================= */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: "Message not found" });

    if (discussion.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized text to delete" });
    }

    discussion.isDeleted = true;
    discussion.message = "This message was deleted";
    discussion.fileUrl = null;
    discussion.fileName = null;
    discussion.fileType = null;
    await discussion.save();

    const populatedMessage = await discussion.populate("sender", "name email");

    io.to(discussion.group.toString()).emit("messageUpdated", populatedMessage);

    res.status(200).json({ message: populatedMessage });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= MARK MESSAGES AS READ ================= */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { context } = req.query; // mark read for specific context
    const userId = req.user._id;

    const query = { group: groupId, readBy: { $ne: userId } };
    if (context) query.context = context;

    await Discussion.updateMany(
      query,
      { $addToSet: { readBy: userId } }
    );

    io.to(groupId).emit("messagesRead", { groupId, userId });

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};