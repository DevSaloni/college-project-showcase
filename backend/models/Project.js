import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["recruiter", "teacher"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const projectSchema = new mongoose.Schema(
  {
    title: String,
    groupName: String,
    category: String,
    categorySlug: String,
    year: String,
    mentor: String,

    projectType: String,
    department: String,
    projectDuration: String,

    problem: String,
    description: String,
    projectOutcome: String,

    tech: String,
    toolsUsed: String,

    github: String,
    demoVideo: String,

    teamMembers: [String],
    featureList: [String],

    bannerImage: String,
    documentation: String,
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },

    // ⭐ RATING
    ratings: {
      totalRating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },


    // 💬 COMMENTS
    comments: [commentSchema],
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  },
  {
    timestamps: true,
  }
);

//auto generate the category slug
projectSchema.pre("save", function (next) {
  if (this.isModified("category")) {
    this.categorySlug = this.category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
  }
  next();
});



const Project = mongoose.model("Project", projectSchema);
export default Project;
