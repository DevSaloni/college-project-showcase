import Group from "../models/Groups.js";
import Discussion from "../models/Discussion.js";
import { io } from "../index.js";

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

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET GROUP DISCUSSION ================= */
export const getGroupDiscussion = async (req, res) => {
  try {
    const { groupId } = req.params;
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