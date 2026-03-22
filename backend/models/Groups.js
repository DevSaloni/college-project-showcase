import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

   
    groupSize: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    approvedTopic: {
      type: String,
      default: null,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
