import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    image: {
      type: String,
      default: "",
    },

    // Extended profile fields (teacher can fill themselves)
    bio: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    qualification: {
      type: String,
      default: "",
    },

    subjects: {
      type: String,
      default: "",
    },

    expertise: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
