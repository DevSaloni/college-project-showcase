import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Group from "../models/Groups.js";
// import Project from "../models/Project.js";
import Proposal from "../models/Proposal.js";
import Project from "../models/ProjectCreate.js";

export const getAdminOverview = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalProjects = await Project.countDocuments();

    const activeGroups = await Group.countDocuments({ status: "Active" });
    const completedGroups = await Group.countDocuments({ status: "Completed" });
    const groupsWithoutMentor = await Group.countDocuments({
      mentor: { $exists: false },
    });

    const studentsWithoutGroup = await Student.countDocuments({
      assignedToGroup: false,
    });

    const pendingProjects = await Project.countDocuments({
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        activeGroups,
        totalProjects,
      },
      groupStatus: {
        activeGroups,
        completedGroups,
        groupsWithoutMentor,
      },
      alerts: {
        studentsWithoutGroup,
        groupsWithoutMentor,
        pendingProjects,
      },
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard data",
    });
  }
};


export const getStudentAcademicAndProject = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= FIND STUDENT ================= */
    const student = await Student.findById(id).populate(
      "userId",
      "name email"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the group this student belongs to (group stores students array)
    const group = await Group.findOne({ students: student._id })
      .populate({
        path: "mentor",
        populate: {
          path: "userId",
          select: "name email",
        },
      });

    // Find the project for this group from ProjectInitial collection
    let project = null;
    let proposal = null;

    if (group) {
      project = await Project.findOne({ groupId: group._id });

      if (project?.proposalId) {
        proposal = await Proposal.findById(project.proposalId);
      }
    }

    /* ================= RESPONSE STRUCTURE ================= */

    res.status(200).json({
      student: {
        id: student._id,
        name: student.userId?.name,
        email: student.userId?.email,
        rollNo: student.rollNo,
        department: student.department,
        year: student.year,
        semester: student.sem,
        status: student.status,
        image: student.image,
      },

      academicDetails: group
        ? {
          groupName: group.groupName,
          groupStatus: group.status,
          mentorName: group?.mentor?.userId?.name || "Not Assigned",
          department: group.department,
          year: group.year,
        }
        : null,

      projectDetails: project
        ? {
          title: project.title,
          totalWeeks: project.totalWeeks,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          proposalStatus: proposal?.status || "N/A",
        }
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getRecentGroups = async (req, res) => {
  try {
    const recentGroups = await Group.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "mentor",
        populate: {
          path: "userId",
          select: "name"   // only get mentor name
        }
      });

    res.json(recentGroups);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};