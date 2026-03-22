import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    /* ===== GROUP INFO ===== */
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    groupName: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: String, // e.g. "Final"
      required: true,
    },

    semester: {
      type: Number, // e.g. 7 or 8
      required: true,
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    /* ===== PROPOSAL DATA ===== */
    title: {
      type: String,
      required: true,
    },

    problemStatement: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    features: {
      type: String,
      required: true,
    },

    techStack: {
      type: String,
      required: true,
    },

    expectedOutcome: {
      type: String,
      required: true,
    },

    /* ===== STATUS ===== */
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    teacherFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);
