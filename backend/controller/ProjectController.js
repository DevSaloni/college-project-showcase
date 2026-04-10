import Project from "../models/Project.js";

//save the project
export const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,

      teamMembers: req.body.teamMembers
        ? Array.isArray(req.body.teamMembers)
          ? req.body.teamMembers
          : typeof req.body.teamMembers === "string"
            ? req.body.teamMembers.split(",").map(i => i.trim())
            : [req.body.teamMembers]
        : [],

      featureList: req.body.featureList
        ? Array.isArray(req.body.featureList)
          ? req.body.featureList
          : typeof req.body.featureList === "string"
            ? req.body.featureList.split(",").map(i => i.trim())
            : [req.body.featureList]
        : [],

      student: req.user._id,

      bannerImage: req.files?.bannerImage?.[0]?.path?.replace(/\\/g, "/"),
      documentation: req.files?.documentation?.[0]?.path?.replace(/\\/g, "/"),
    });

    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all project
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();

    const projects = await Project.find({ status: "Pending" }).populate("student", "name email");

    const mongoose = await import("mongoose");
    const StudentModel = (await import("../models/Student.js")).default;
    const GroupModel = (await import("../models/Groups.js")).default;

    const data = await Promise.all(projects.map(async (p) => {
      let allCreators = [];
      if (p.student) {
        const submitterStudent = await StudentModel.findOne({ userId: p.student._id });
        if (submitterStudent) {
          const group = await GroupModel.findOne({ students: submitterStudent._id });
          if (group) {
            allCreators = await StudentModel.find({ _id: { $in: group.students } }).populate("userId", "name email");
          } else {
            await submitterStudent.populate("userId", "name email");
            allCreators = [submitterStudent];
          }
        }
      }

      return {
        ...p.toObject(),
        creatorProfiles: allCreators,
        bookmarksCount: p.bookmarks.length,
        isBookmarked: userId
          ? p.bookmarks.map(id => id.toString()).includes(userId)
          : false,
      };
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error("Explore Fetch Error", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("comments.user", "name role")
      .populate("student", "name email")
      .populate("views", "name role")
      .populate("ratings.users", "name role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ COUNT UNIQUE VIEWS (teacher / recruiter only)
    if (
      req.user &&
      project.student._id.toString() !== req.user._id.toString()
    ) {
      const alreadyViewed = project.views.some(
        (u) => u.toString() === req.user._id.toString()
      );

      if (!alreadyViewed) {
        project.views.push(req.user._id);
        await project.save();
      }
    }

    // Fetch the detailed Student profile for this user
    const mongoose = await import("mongoose");
    const StudentModel = (await import("../models/Student.js")).default;
    const GroupModel = (await import("../models/Groups.js")).default;

    const submitterStudent = await StudentModel.findOne({ userId: project.student._id });

    let allCreators = [];
    if (submitterStudent) {
      const group = await GroupModel.findOne({ students: submitterStudent._id });
      if (group) {
        allCreators = await StudentModel.find({ _id: { $in: group.students } }).populate("userId", "name email");
      } else {
        await submitterStudent.populate("userId", "name email");
        allCreators = [submitterStudent];
      }
    }

    // Attach creator profiles to the response safely
    const projectData = project.toObject();
    projectData.creatorProfiles = allCreators;

    res.status(200).json({ data: projectData });
  } catch (err) {
    console.error("View Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//add  rating 
export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;

    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can rate" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // ✅ prevent duplicate rating
    if (project.ratings.users.includes(req.user._id)) {
      return res.status(400).json({ message: "You already rated this project" });
    }

    project.ratings.totalRating += rating;
    project.ratings.ratingCount += 1;
    project.ratings.users.push(req.user._id);

    await project.save();

    res.status(200).json({ message: "Rating added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



//add comment 
export const addComment = async (req, res) => {
  try {
    if (!["recruiter", "teacher"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only Recruiters and Teachers can comment",
      });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.comments.push({
      user: req.user._id,
      role: req.user.role,
      text,
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("comments.user", "name");

    res.status(200).json({
      message: "Comment added",
      comments: populatedProject.comments,
    });
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//bookmark
export const bookmarkProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user._id.toString();

    const alreadyBookmarked = project.bookmarks
      .map(id => id.toString())
      .includes(userId);

    if (alreadyBookmarked) {
      project.bookmarks = project.bookmarks.filter(
        id => id.toString() !== userId
      );
    } else {
      project.bookmarks.push(userId);
    }

    await project.save();

    return res.status(200).json({
      bookmarksCount: project.bookmarks.length,
      isBookmarked: !alreadyBookmarked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





export const getProjectsByCategory = async (req, res) => {
  try {
    const slug = req.params.slug;

    const projects = await Project.find({
      categorySlug: slug
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error("Category fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


//get student project by status 
export const getMyProjectsByStatus = async (req, res) => {
  try {
    const studentId = req.user._id;

    const projects = await Project.find({ student: studentId })
      .sort({ createdAt: -1 });

    const grouped = {
      Approved: [],
      Pending: [],
      Rejected: [],
    };

    projects.forEach(project => {
      grouped[project.status].push(project);
    });

    res.status(200).json({
      data: grouped,
      counts: {
        approved: grouped.Approved.length,
        pending: grouped.Pending.length,
        rejected: grouped.Rejected.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//get projectby id 
export const getProjectByStudentId = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      student: req.user._id // ensures only their own project
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//update project by id 
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "category",
      "projectType",
      "projectDuration",
      "problem",
      "description",
      "projectOutcome",
      "tech",
      "toolsUsed",
      "github",
      "demoVideo",
      "teamMembers",
      "featureList",
      "department",
      "year",
      "groupName",
      "mentor"
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "teamMembers" || field === "featureList") {
          updates[field] = Array.isArray(req.body[field]) ? req.body[field] : (typeof req.body[field] === "string" ? req.body[field].split(",").map(i => i.trim()) : []);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Auto-update slug if category is modified
    if (updates.category) {
      updates.categorySlug = updates.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, student: req.user._id }, // only update if owned by student
      { $set: updates },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found or not yours" });

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};


