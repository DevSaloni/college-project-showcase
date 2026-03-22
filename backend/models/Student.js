import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
    },

    department: String,
    year: String,
    sem: String,

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    assignedToGroup: {
      type: Boolean,
      default: false,
    },

    image: String, // image path / url




    // ===== NEW PROFILE FIELDS =====

    bio: String,
    location: String,

    technicalSkills: [String],
    softSkills: [String],

    openToWork: {
      type: Boolean,
      default: false,
    },

    interestedRoles: [String], // e.g. Frontend Developer

    achievements: [String],
    certifications: [String],

    linkedin: String,
    github: String,
    portfolio: String,
    resume: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
