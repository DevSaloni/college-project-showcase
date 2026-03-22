import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    // 🔗 Which group this discussion belongs to
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    
    // 🏷️ Context (proposal phase or progress phase)
    context: {
      type: String,
      enum: ["proposal", "progress"],
      default: "proposal",
    },

    // 💬 Actual message (make it optional if they just send an image)
    message: {
      type: String,
      trim: true,
      default: "",
    },

    // 👤 Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🎭 Role helps UI styling (teacher / student)
    senderRole: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },

    // 📁 Attachment support
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      default: null,
    },

    // ✏️ Edit & Delete flags
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // 👀 Read Receipts tracking
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("Discussion", discussionSchema);
