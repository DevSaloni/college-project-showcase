import User from "../models/User.js";
import Student from "../models/Student.js";
import Group from "../models/Groups.js";
import bcrypt from "bcryptjs";
import Proposal from "../models/Proposal.js";
import ProjectInitial from "../models/ProjectCreate.js";
import ProjectProgress from "../models/ProjectProgress.js";
import mongoose from "mongoose";

export const addStudentByAdmin = async (req, res) => {
  try {
    const { email, rollNo, department, year, sem, status } = req.body;

    // 1️⃣ user must exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not registered. Ask student to register first",
      });
    }

    // 2️⃣ check student profile
    const studentExists = await Student.findOne({ userId: user._id });
    if (studentExists) {
      return res.status(400).json({ message: "Student already added" });
    }

    // 3️⃣ create student profile
    const student = await Student.create({
      userId: user._id,
      rollNo,
      department,
      year,
      sem,
      status,
      image: req.file ? `/uploads/students/${req.file.filename}` : null,
    });

    res.status(201).json({ success: true, student });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email") // populate student name/email
      .sort({ createdAt: -1 });

    const studentsWithGroup = await Promise.all(
      students.map(async (student) => {
        // find the group for this student
        const group = await Group.findOne({ students: student._id })
          .select("groupName");

        return {
          _id: student._id,
          rollNo: student.rollNo,
          department: student.department,
          year: student.year,
          status: student.status,
          userId: student.userId, // contains name & email
          group: group ? { _id: group._id, name: group.groupName } : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentsWithGroup.length,
      students: studentsWithGroup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};



/* ================= GET STUDENTS FOR GROUP ================= */
export const getStudentsForGroup = async (req, res) => {
  try {
    const students = await Student.find({ assignedToGroup: false })
      .populate("userId", "name")
      .select("rollNo userId");

    res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

//get student by id 

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("userId", "name email");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const group = await Group.findOne({ students: student._id })
      .populate({
        path: "mentor",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("project");

    // also fetch project progress for this student if it exists
    const progress = await ProjectProgress.findOne({ studentId: student._id });

    //also fetch project status
    const projectsCount = group ? await Proposal.countDocuments({ groupId: group._id }) : 0;
    const approvedProjects = group ? await Proposal.countDocuments({ groupId: group._id, status: "Approved" }) : 0;

    res.status(200).json({
      success: true,
      student,
      group,
      progress,
      stats: {
        totalProjects: projectsCount,
        approvedProjects: approvedProjects,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update student by id 
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      rollNo,
      department,
      year,
      sem,
      status,
      bio,
      location,
      technicalSkills,
      softSkills,
      openToWork,
      interestedRoles,
      achievements,
      certifications,
      linkedin,
      github,
      portfolio,
      resume,
      phone,
    } = req.body;

    const studentIdToUpdate = id;
    const currentUser = req.user;

    // 🔐 SECURITY CHECK: Only Admin or the Student themselves can update this profile
    const existingStudent = await Student.findById(studentIdToUpdate);
    if (!existingStudent) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    const isOwner = existingStudent.userId.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized: You can only update your own profile." });
    }

    const updatedData = {
      rollNo,
      department,
      year,
      sem,
      status,
      bio,
      location,
      technicalSkills: technicalSkills ? (Array.isArray(technicalSkills) ? technicalSkills : technicalSkills.split(",").map(s => s.trim()).filter(Boolean)) : [],
      softSkills: softSkills ? (Array.isArray(softSkills) ? softSkills : softSkills.split(",").map(s => s.trim()).filter(Boolean)) : [],
      openToWork: openToWork === "true" || openToWork === true,
      interestedRoles: interestedRoles ? (Array.isArray(interestedRoles) ? interestedRoles : interestedRoles.split(",").map(s => s.trim()).filter(Boolean)) : [],
      achievements: achievements ? (Array.isArray(achievements) ? achievements : achievements.split(",").map(s => s.trim()).filter(Boolean)) : [],
      certifications: certifications ? (Array.isArray(certifications) ? certifications : certifications.split(",").map(s => s.trim()).filter(Boolean)) : [],
      linkedin,
      github,
      portfolio,
      resume,
      phone,
    };

    if (req.file) {
      updatedData.image = `/uploads/students/${req.file.filename}`;
    }

    const student = await Student.findByIdAndUpdate(
      studentIdToUpdate,
      updatedData,
      { new: true }
    ).populate("userId", "name email");

    // Update User name/email if provided (only if they are the owner or admin)
    if (name || email) {
      await User.findByIdAndUpdate(student.userId._id, { name, email });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate("userId", "name email");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    const group = await Group.findOne({ students: student._id });
    const projectsCount = group ? await Proposal.countDocuments({ groupId: group._id }) : 0;
    const approvedProjects = group ? await Proposal.countDocuments({ groupId: group._id, status: "Approved" }) : 0;

    res.status(200).json({
      success: true,
      student,
      stats: {
        totalProjects: projectsCount,
        approvedProjects: approvedProjects,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete the student by id 
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Find group containing this student
    const group = await Group.findOne({ students: id });

    if (group) {
      // 3️⃣ Remove student from group
      group.students = group.students.filter(
        sId => sId.toString() !== id
      );

      // 4️⃣ If group has less than 3 students → DELETE GROUP
      if (group.students.length < 3) {

        // 🔥 Free remaining students
        await Student.updateMany(
          { _id: { $in: group.students } },
          { $set: { assignedToGroup: false } }
        );

        // 🔥 Delete group
        await Group.findByIdAndDelete(group._id);

      } else {
        // 5️⃣ Otherwise save updated group
        await group.save();
      }
    }

    // 6️⃣ Delete linked user
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }

    // 7️⃣ Delete student
    await Student.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Student deleted and group handled correctly",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//get student project of all sem 


export const getMyAcademicProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find Student using userId
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // 2️⃣ Find Group where this student exists
    const group = await Group.findOne({
      students: student._id,
    });

    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Student not assigned to any group",
      });
    }

    // 3️⃣ Get all proposals of this group
    const proposals = await Proposal.find({ groupId: group._id })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name",
        },
      }).sort({ semester: 1 });

    const semesterMap = {};

    for (const proposal of proposals) {
      let projectData = {
        // Default identifier comes from the proposal itself
        _id: proposal._id,
        title: proposal.title,
        semester: proposal.semester,
        mentorName: proposal.mentorId?.userId?.name || "Not Assigned",
        mentorId: proposal.mentorId?._id,
        teacherFeedback: proposal.teacherFeedback,
      };

      if (proposal.status === "Approved") {
        const project = await ProjectInitial.findOne({
          proposalId: proposal._id,
        });

        if (project) {
          const progress = await ProjectProgress.findOne({
            projectId: project._id,
          });

          projectData = {
            ...projectData,
            // For Active/Completed projects, identifier should be the project ID
            _id: project._id,
            status: project.status,
            startDate: formatDate(project.startDate),
            endDate: formatDate(project.endDate),
            progressPercent: progress?.progressPercent || 0,
          };
        } else {
          projectData.status = "Approved";
        }
      } else {
        projectData.status = proposal.status;
      }

      if (!semesterMap[proposal.semester]) {
        semesterMap[proposal.semester] = {
          semester: proposal.semester,
          projects: [],
        };
      }

      semesterMap[proposal.semester].projects.push(projectData);
    }

    const responseData = Object.values(semesterMap);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

function formatDate(date) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}



export const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    console.log("Received ID:", id);

    /* ===== 1️⃣ Get ProjectInitial ===== */
    const project = await ProjectInitial.findById(id)
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .populate("groupId", "groupName department year semester")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    /* ===== 2️⃣ Get Proposal ===== */
    const proposal = project.proposalId
      ? await Proposal.findById(project.proposalId).lean()
      : null;

    /* ===== 3️⃣ Get Project Progress ===== */
    const progress = await ProjectProgress.findOne({
      projectId: id,
    }).lean();

    /* ===== 4️⃣ Merge All Data */
    const fullProjectDetails = {
      _id: project._id,
      title: project.title,
      status: project.status,
      totalWeeks: project.totalWeeks,
      startDate: project.startDate,
      endDate: project.endDate,

      // Academic
      groupName: project.groupId?.groupName,
      department: proposal?.department,
      year: proposal?.year,
      semester: proposal?.semester,
      mentorName:
        project.mentorId?.userId?.name || "Not Assigned",
      mentorId: project.mentorId?._id,

      // Overview
      problemStatement: proposal?.problemStatement,
      description: proposal?.description,
      expectedOutcome: proposal?.expectedOutcome,
      features: proposal?.features || [],
      techStack: proposal?.techStack || [],
      teacherFeedback: proposal?.teacherFeedback,

      // Progress
      progressPercent: progress?.progressPercent || 0,
      milestones: progress?.milestones || [],
    };

    return res.status(200).json({
      success: true,
      data: fullProjectDetails,
    });

  } catch (error) {
    console.error("Project Details Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};