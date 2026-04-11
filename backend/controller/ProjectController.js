import Project from "../models/Project.js";
import StudentModel from "../models/Student.js";
import GroupModel from "../models/Groups.js";
import mongoose from "mongoose";

// Helper for parsing comma-separated strings into trimmed arrays
const parseList = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(i => i?.trim()).filter(Boolean);
  if (typeof input === "string") {
    // Split by comma OR newline
    return input.split(/[,\n]/).map(i => i.trim()).filter(Boolean);
  }
  return [input];
};

// save the project
export const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      teamMembers: parseList(req.body.teamMembers),
      featureList: parseList(req.body.featureList),
      student: req.user._id,
      status: "Approved", // Auto-approve for immediate visibility on Explore page
      bannerImage: req.files?.bannerImage?.[0]?.path?.replace(/\\/g, "/"),
      documentation: req.files?.documentation?.[0]?.path?.replace(/\\/g, "/"),
    });

    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Project Create Error:", error);
    res.status(500).json({ success: false, message: "Failed to create project. Check if all required fields are present." });
  }
};

// get all project for Explore page with Search, Filter & Pagination
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const {
      search,
      category,
      page = 1,
      limit = 9,
      sort = "-createdAt"
    } = req.query;

    const query = { status: { $in: ["Approved", "Pending"] } };

    // 🔍 Fuzzy Search (Across Title, Description, Tech, Department)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tech: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { groupName: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷️ Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch Projects with Pagination
    const totalProjects = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("student", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalPages = Math.ceil(totalProjects / limit);

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
        bookmarksCount: p.bookmarks?.length || 0,
        isBookmarked: userId ? p.bookmarks?.some(id => id.toString() === userId) || false : false,
      };
    }));

    res.status(200).json({
      success: true,
      pagination: {
        totalProjects,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      data
    });
  } catch (error) {
    console.error("Explore Fetch Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch innovations feed." });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("comments.user", "name role image")
      .populate("student", "name email")
      .populate("views", "name role")
      .populate("ratings.users", "name role");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // UNIQUE VIEWS LOGIC
    if (req.user && project.student?._id?.toString() !== req.user._id.toString()) {
      const alreadyViewed = project.views?.some(u => u.toString() === req.user._id.toString());
      if (!alreadyViewed) {
        project.views.push(req.user._id);
        await project.save();
      }
    }

    const submitterStudent = await StudentModel.findOne({ userId: project.student?._id });
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

    const projectData = project.toObject();
    projectData.creatorProfiles = allCreators;

    res.status(200).json({ success: true, data: projectData });
  } catch (err) {
    console.error("View Project Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error fetching project details." });
  }
};

// add rating (Recruiters only)
export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Restricted: Only recruiters can submit project evaluations." });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.ratings.users.some(u => u.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: "You have already evaluated this project." });
    }

    project.ratings.totalRating += Number(rating);
    project.ratings.ratingCount += 1;
    project.ratings.users.push(req.user._id);

    await project.save();
    res.status(200).json({ success: true, message: "Rating submitted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit rating." });
  }
};

// add comment
export const addComment = async (req, res) => {
  try {
    if (!["recruiter", "teacher"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Restricted: Only Recruiters and Teachers can participate in discussion." });
    }

    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment content cannot be empty." });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    project.comments.push({
      user: req.user._id,
      role: req.user.role,
      text: text.trim(),
    });

    await project.save();

    const populatedProject = await Project.findById(project._id).populate("comments.user", "name image");
    res.status(200).json({ success: true, message: "Insight added.", comments: populatedProject.comments });
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ success: false, message: "Failed to post comment." });
  }
};

// bookmark
export const bookmarkProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const userId = req.user._id.toString();
    const alreadyBookmarked = project.bookmarks?.some(id => id.toString() === userId);

    if (alreadyBookmarked) {
      project.bookmarks = project.bookmarks.filter(id => id.toString() !== userId);
    } else {
      project.bookmarks.push(userId);
    }

    await project.save();
    return res.status(200).json({ success: true, bookmarksCount: project.bookmarks.length, isBookmarked: !alreadyBookmarked });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle bookmark." });
  }
};

export const getProjectsByCategory = async (req, res) => {
  try {
    const slug = req.params.slug;
    const projects = await Project.find({ categorySlug: slug, status: { $in: ["Approved", "Pending"] } }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error fetching category." });
  }
};

// get student project by status
export const getMyProjectsByStatus = async (req, res) => {
  try {
    const studentId = req.user._id;
    const projects = await Project.find({ student: studentId }).sort({ createdAt: -1 });

    const grouped = { Approved: [], Pending: [], Rejected: [] };
    projects.forEach(project => { if (grouped[project.status]) grouped[project.status].push(project); });

    res.status(200).json({
      success: true,
      data: grouped,
      counts: {
        approved: grouped.Approved.length,
        pending: grouped.Pending.length,
        rejected: grouped.Rejected.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching status." });
  }
};

// get project for update
export const getProjectByStudentId = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, student: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or unauthorized access." });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update project by id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "title", "category", "projectType", "projectDuration", "problem", "description",
      "projectOutcome", "tech", "toolsUsed", "github", "demoVideo", "teamMembers",
      "featureList", "department", "year", "groupName", "mentor"
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "teamMembers" || field === "featureList") {
          updates[field] = parseList(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    if (updates.category) {
      updates.categorySlug = updates.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, student: req.user._id },
      { $set: updates },
      { new: true }
    );

    if (!project) return res.status(404).json({ success: false, message: "Project not found or unauthorized." });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Update failed. Database connection error." });
  }
};


