import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    week: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    repoLink: {
      type: String,
      default: "",
    },

    files: [
      {
        filename: String,
        path: String,
      },
    ],

    completed: {
      type: Boolean,
      default: false,
    },

    mentorFeedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reviewedAt: {
      type: Date,
    },
  }
);

const projectProgressSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectInitial",
      required: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Made optional since progress really belongs to the group
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    milestones: [milestoneSchema],

    progressPercent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProjectProgress", projectProgressSchema);
