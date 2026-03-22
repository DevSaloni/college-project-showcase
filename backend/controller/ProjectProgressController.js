import ProjectProgress from "../models/ProjectProgress.js";
import ProjectInitial from "../models/ProjectCreate.js";
import Group from "../models/Groups.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

import mongoose from "mongoose";

export const submitProgress = async (req, res) => {
  try {
    const { projectId, week, title, description, repoLink } = req.body;
    const userId = req.user._id;

    if (!projectId || !week || !title) {
      return res.status(400).json({
        message: "Project, week and title required",
      });
    }

    const project = await ProjectInitial.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not assigned",
      });
    }

    // FIND per group project, NOT per student ID. All students share this.
    let progress = await ProjectProgress.findOne({
      projectId,
    });

    if (!progress) {
      progress = new ProjectProgress({
        projectId,
        groupId: project.groupId,
        mentorId: project.mentorId,
        studentId: userId, // legacy reference to the student who first initialized
        milestones: [],
      });
    }

    const existingMilestone = progress.milestones.find(
      (m) => Number(m.week) === Number(week)
    );

    if (existingMilestone) {

      // If already approved → do not allow resubmit
      if (existingMilestone.status === "approved") {
        return res.status(400).json({
          message: "Week already approved. Cannot resubmit.",
        });
      }

      // If pending → do not allow duplicate submission
      if (existingMilestone.status === "pending") {
        return res.status(400).json({
          message: "Week submission is under review.",
        });
      }

      // If rejected → allow update (RESUBMIT)
      if (existingMilestone.status === "rejected") {
        existingMilestone.title = title;
        existingMilestone.description = description;
        existingMilestone.repoLink = repoLink;
        existingMilestone.files = req.files?.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })) || [];

        existingMilestone.status = "pending";
        existingMilestone.mentorFeedback = "";
        existingMilestone.submittedAt = new Date();
        existingMilestone.submittedBy = userId; // update submitter if resubmitted

        await progress.save();

        return res.status(200).json({
          message: "Week resubmitted successfully",
        });
      }
    }


    const files =
      req.files?.map((file) => ({
        filename: file.originalname,
        path: file.path,
      })) || [];

    progress.milestones.push({
      title,
      week,
      description,
      repoLink,
      files,
      status: "pending",
      submittedBy: userId, // record who submitted this specific week
    });

    await progress.save();

    res.status(201).json({
      message: "Progress submitted successfully",
    });
  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const student = await Student.findOne({ userId });
    if (!student) {
      return res.json({ project: null, milestones: [], progressPercentage: 0 });
    }

    const group = await Group.findOne({ students: student._id });
    if (!group) {
      return res.json({ project: null, milestones: [], progressPercentage: 0 });
    }

    const project = await ProjectInitial.findOne({
      groupId: group._id,
    }).populate({
      path: "mentorId", // Teacher
      populate: {
        path: "userId", // User inside Teacher
        select: "name email",
      },
    });

    if (!project) {
      return res.json({ project: null, milestones: [], progressPercentage: 0 });
    }

    // fetch by project so any student in group sees the same
    const progress = await ProjectProgress.findOne({
      projectId: project._id,
    });

    res.json({
      project: {
        _id: project._id,
        groupId: group._id, // ✅ Crucial for chat
        title: project.title,
        mentorName: project.mentorId?.userId?.name || "Not assigned",
        mentorEmail: project.mentorId?.userId?.email || "—",
      },
      milestones: progress?.milestones || [],
      progressPercentage: progress?.progressPercent || 0,
    });

  } catch (error) {
    console.error("Fetch Progress Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//get all submission for teachers 
export const getMentorSubmissions = async (req, res) => {
  try {
    // 1️⃣ Find teacher by logged in user
    const teacher = await Teacher.findOne({ userId: req.user._id });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { status } = req.query;

    // 2️⃣ Use teacher._id (NOT user._id)
    const progresses = await ProjectProgress.find({ mentorId: teacher._id })
      .populate("studentId", "name")
      .populate("groupId", "groupName")
      .populate("projectId", "title")
      .populate("milestones.submittedBy", "name"); // populate whoever submitted the specific milestone

    let submissions = [];

    progresses.forEach((progress) => {
      progress.milestones.forEach((milestone) => {
        submissions.push({
          progressId: progress._id,
          milestoneId: milestone._id,
          groupName: progress.groupId?.groupName || "—",
          projectTitle: progress.projectId?.title || "—",
          week: milestone.week,
          submittedAt: milestone.submittedAt,
          status: milestone.status,
          mentorFeedback: milestone.mentorFeedback || "",  // ✅ ADD THIS
          studentName: milestone.submittedBy?.name || progress.studentId?.name || "Group Submission",
        });
      });
    });

    const filtered = status
      ? submissions.filter((s) => s.status === status)
      : submissions;

    const stats = {
      totalGroups: new Set(
        progresses.map((p) => p.groupId?._id.toString())
      ).size,
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    };

    res.json({ submissions: filtered, stats });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// get single submission
export const getSingleSubmission = async (req, res) => {
  try {
    const { progressId, milestoneId } = req.params;

    const progress = await ProjectProgress.findById(progressId)
      .populate("studentId", "name email")
      .populate("groupId", "name")
      .populate("projectId", "title")
      .populate("milestones.submittedBy", "name email");

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const milestone = progress.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.json({
      student: milestone.submittedBy || progress.studentId || { name: "Group" },
      group: progress.groupId,
      project: progress.projectId,
      milestone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//review milestone
export const reviewMilestone = async (req, res) => {
  try {
    const { progressId, milestoneId, status, mentorFeedback } = req.body;

    const progress = await ProjectProgress.findById(progressId);

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const milestone = progress.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    milestone.status = status;
    milestone.mentorFeedback = mentorFeedback || "";
    milestone.completed = status === "approved";
    milestone.reviewedAt = new Date();

    // ✅ CORRECT PROGRESS CALCULATION
    const project = await ProjectInitial.findById(progress.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const totalWeeks = project.totalWeeks;

    const completedWeeks = progress.milestones.filter(
      (m) => m.status === "approved"
    ).length;

    progress.progressPercent =
      totalWeeks > 0
        ? Math.round((completedWeeks / totalWeeks) * 100)
        : 0;

    await progress.save();

    res.json({ message: "Review updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//