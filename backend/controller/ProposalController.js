import mongoose from "mongoose";

import Proposal from "../models/Proposal.js";

import Group from "../models/Groups.js";
import Discussion from "../models/Discussion.js";
import ProjectInitial from "../models/ProjectCreate.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { createNotification } from "./NotificationController.js";

/* ================= CREATE PROPOSAL (STUDENT) ================= */
export const createProposal = async (req, res) => {
  try {
    const proposal = await Proposal.create({
      ...req.body,
      studentId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    });

    // --- NOTIFICATION LOGIC ---
    try {
      const mentor = await Teacher.findById(proposal.mentorId);
      if (mentor) {
        await createNotification({
          recipient: mentor.userId,
          sender: req.user._id,
          type: "proposal",
          title: "New Proposal Submitted",
          message: `A new project proposal "${proposal.title}" has been submitted for your review.`,
          link: `/teacher-dashboard/groups/${proposal.groupId}`,
          metadata: { groupId: proposal.groupId, proposalId: proposal._id }
        });
      }
    } catch (err) { console.error("Notification error:", err); }
  } catch (error) {
    console.error("Create proposal error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET PROPOSALS FOR TEACHER ================= */
//get proposal ,disscusion ,group dtaa  


export const getWorkspaceData = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await Group.findById(groupId)
      .populate({
        path: "mentor",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "students",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const proposal = await Proposal.findOne({
      groupId: new mongoose.Types.ObjectId(groupId),
    }).populate({
      path: "mentorId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    const project = await ProjectInitial.findOne({ groupId }); // ✅ ADDED

    const messages = await Discussion.find({ groupId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      group,
      proposal,
      project,
      messages,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= UPDATE PROPOSAL STATUS ================= */
export const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teacherFeedback, totalWeeks } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.status = status;
    proposal.teacherFeedback = teacherFeedback || "";
    await proposal.save();

    let project = null;

    if (status === "Approved") {

      if (!totalWeeks || totalWeeks <= 0) {
        return res.status(400).json({
          message: "Project duration (weeks) is required",
        });
      }

      const exists = await ProjectInitial.findOne({
        proposalId: proposal._id,
      });

      if (!exists) {

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + totalWeeks * 7);

        project = await ProjectInitial.create({
          title: proposal.title,
          groupId: proposal.groupId,
          mentorId: proposal.mentorId,
          proposalId: proposal._id,
          totalWeeks,
          startDate,
          endDate,
        });

      } else {
        project = exists;
      }
    }

    res.status(200).json({
      message:
        status === "Approved"
          ? "Proposal approved & project created"
          : "Proposal rejected",
      proposal,
      project,
    });

    // --- NOTIFICATION LOGIC ---
    try {
      const group = await Group.findById(proposal.groupId);
      if (group) {
        const students = await Student.find({ _id: { $in: group.students } });
        for (const student of students) {
          await createNotification({
            recipient: student.userId,
            sender: req.user._id,
            type: "proposal",
            title: `Proposal ${status}`,
            message: `Your project proposal "${proposal.title}" has been ${status.toLowerCase()}. ${teacherFeedback ? 'Click to see feedback.' : ''}`,
            link: "/student-dashboard/proposal",
            metadata: { proposalId: proposal._id, status }
          });
        }
      }
    } catch (err) { console.error("Notification error:", err); }

  } catch (error) {
    console.error("Update proposal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//get proposal existing 
export const getProposalByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }
    const proposal = await Proposal.findOne({ groupId });

    const project = await ProjectInitial.findOne({ groupId });

    if (!proposal) {
      return res.status(404).json({ message: "No proposal found" });
    }

    res.status(200).json({
      proposal,
      project, // contains totalWeeks, startDate, endDate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//update proposal by student 
export const updateProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return res.status(400).json({ message: "Invalid proposal id" });
    }
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.status === "Approved") {
      return res
        .status(403)
        .json({ message: "Approved proposal cannot be edited" });
    }

    // Reset status to "Pending" if resubmitting
    const updateData = {
      ...req.body,
      status: "Pending",
      teacherFeedback: "" // Clear feedback on resubmit
    };

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });

    // --- NOTIFICATION LOGIC ---
    try {
      const mentor = await Teacher.findById(updatedProposal.mentorId);
      if (mentor) {
        await createNotification({
          recipient: mentor.userId,
          sender: req.user._id,
          type: "proposal",
          title: "Proposal Updated",
          message: `The proposal "${updatedProposal.title}" has been resubmitted after changes.`,
          link: `/teacher-dashboard/groups/${updatedProposal.groupId}`,
          metadata: { groupId: updatedProposal.groupId, proposalId: updatedProposal._id }
        });
      }
    } catch (err) { console.error("Notification error:", err); }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


