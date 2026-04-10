import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Group from "../models/Groups.js";
import Project from "../models/Project.js";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import ProjectProgress from "../models/ProjectProgress.js";
import Proposal from "../models/Proposal.js";
import ProjectInitial from "../models/ProjectCreate.js";

/* ================= ADD TEACHER ================= */
export const addTeacher = async (req, res) => {
  try {
    const { email, department, designation, phone, status } = req.body;

    // 1️⃣ User MUST already exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not registered. Ask teacher to register first",
      });
    }

    // 2️⃣ Check teacher profile
    const teacherExists = await Teacher.findOne({ userId: user._id });
    if (teacherExists) {
      return res.status(400).json({ message: "Teacher already added" });
    }

    // 3️⃣ Create teacher profile ONLY
    const teacher = await Teacher.create({
      userId: user._id,
      department,
      designation,
      phone,
      status,
      image: req.file ? `/uploads/teachers/${req.file.filename}` : "",
    });

    res.status(201).json({
      success: true,
      teacher,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET ALL TEACHERS ================= */
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "name email");

    res.status(200).json({ teachers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

/* ================= GET TEACHER PROFILE ================= */
export const getTeacherProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const teacher = await Teacher.findOne({ userId })
      .populate("userId", "name email");

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // Number of groups assigned to this teacher
    const groups = await Group.find({ mentor: teacher._id });
    const studentsCount = groups.reduce(
      (total, g) => total + g.students.length,
      0
    );

    res.status(200).json({
      success: true,
      teacher,
      groupsAssigned: groups.length,
      studentsCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET TEACHERS FOR DROPDOWN ================= */
export const getTeachersForGroup = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "name")
      .select("userId");

    const formattedTeachers = await Promise.all(
      teachers.map(async (t) => {
        const groupCount = await Group.countDocuments({ mentor: t._id });
        return {
          id: t._id,
          name: t.userId.name,
          groupCount,
        };
      })
    );

    res.status(200).json({ teachers: formattedTeachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

//get teachers by id 

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("userId", "name email");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // groups under this mentor
    const groups = await Group.find({ mentor: teacher._id })
      .populate("students");

    const studentsCount = groups.reduce(
      (total, g) => total + g.students.length,
      0
    );

    res.status(200).json({
      teacher,
      groupsAssigned: groups.length,
      studentsCount,
      groups,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//update techers data 
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      department,
      designation,
      phone,
      status,
    } = req.body;

    const updatedData = {
      department,
      designation,
      phone,
      status,
    };

    if (req.file) {
      updatedData.image = `/uploads/teachers/${req.file.filename}`;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//delete the teacher by id 
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find teacher
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 2️⃣ Find groups assigned to this teacher
    const groups = await Group.find({ mentor: id });

    // 3️⃣ Collect all students from those groups
    const studentIds = groups.flatMap(group => group.students);

    // 4️⃣ Free students (VERY IMPORTANT)
    if (studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $set: { assignedToGroup: false } }
      );
    }

    // 5️⃣ Delete groups of this teacher
    await Group.deleteMany({ mentor: id });

    // 6️⃣ Delete linked user account
    await User.findByIdAndDelete(teacher.userId);

    // 7️⃣ Delete teacher
    await Teacher.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Teacher deleted, groups removed, students freed",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//*****************************************teacher dashbaord**************** */
//get all student by assigned to tecaher 
// GET logged-in teacher students
export const getTeacherStudents = async (req, res) => {
  try {
    const userId = req.user._id; // from token

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const groups = await Group.find({ mentor: teacher._id })
      .populate({
        path: "students",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .select("groupName students");

    const students = groups.flatMap(group =>
      group.students.map(student => ({
        _id: student._id,
        rollNo: student.rollNo,
        status: student.status,
        groupName: group.groupName,
        user: student.userId,
      }))
    );

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get student by id from assigned tecaher
export const getTeacherStudentById = async (req, res) => {
  try {
    const teacherUserId = req.user._id;
    const { id } = req.params; // 👈 FIXED

    const teacher = await Teacher.findOne({ userId: teacherUserId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const student = await Student.findById(id)
      .populate("userId", "name email");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const group = await Group.findOne({
      mentor: teacher._id,
      students: student._id,
    }).select("groupName");

    if (!group) {
      return res.status(403).json({
        message: "Student not assigned to this teacher",
      });
    }

    const progresses = await ProjectProgress.find({
      studentId: student.userId
    }).populate("projectId", "title");

    let formattedProjects = [];

    progresses.forEach(progress => {
      progress.milestones.forEach(m => {
        formattedProjects.push({
          _id: m._id,
          title: m.title || progress.projectId?.title || "Project Task",
          week: m.week,
          description: m.description,
          github: m.repoLink,
          status: m.status,
          createdAt: m.submittedAt
        });
      });
    });
    res.status(200).json({
      success: true,
      student: {
        _id: student._id,
        name: student.userId.name,
        email: student.userId.email,
        rollNo: student.rollNo,
        department: student.department,
        year: student.year,
        status: student.status,
        groupName: group.groupName,
      },
      projects: formattedProjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//get all group assign to tecaher

export const getTeacherGroups = async (req, res) => {
  try {
    const teacherUserId = req.user._id;

    /* 1️⃣ Find teacher profile */
    const teacher = await Teacher.findOne({ userId: teacherUserId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    /* 2️⃣ Get groups assigned to this teacher */
    const groups = await Group.find({ mentor: teacher._id })
      .populate("students", "_id")
      .sort({ updatedAt: -1 });

    /* 3️⃣ Build response */
    const formattedGroups = await Promise.all(
      groups.map(async (group) => {

        /* 🔹 Find proposal for this group */
        const proposal = await Proposal.findOne({
          groupId: group._id,
        }).select("title status");

        /* 🔹 Find project created after approval */
        const project = await ProjectInitial.findOne({
          groupId: group._id,
        }).select("title status updatedAt");

        /* ===== GROUP STATUS ===== */
        let status = "Proposal Pending";

        if (proposal?.status === "Rejected") {
          status = "Changes Required";
        }

        if (proposal?.status === "Approved") {
          status = project?.status === "Completed"
            ? "Submitted"
            : "In Progress";
        }

        /* ===== REVIEW STAGE ===== */
        let review = "Waiting For Review";

        if (proposal?.status === "Rejected") {
          review = "Changes Required";
        }

        if (proposal?.status === "Approved") {
          review = "Proposal Approved";
        }

        return {
          _id: group._id,

          name: group.groupName,

          project:
            project?.title ||
            proposal?.title ||
            "Proposal not submitted",

          students: group.students.length,

          status,

          review,

          updated: project?.updatedAt
            ? project.updatedAt.toDateString()
            : group.updatedAt.toDateString(),
        };
      })
    );

    /* 4️⃣ Send response */
    res.status(200).json({
      success: true,
      count: formattedGroups.length,
      groups: formattedGroups,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


//get groups by id of tecahers assign 
export const getTeacherGroupById = async (req, res) => {
  try {
    const teacherUserId = req.user._id;
    const { id } = req.params; // ✅ FIXED

    if (!id) {
      return res.status(400).json({ message: "Group ID missing" });
    }

    // 1️⃣ Find teacher
    const teacher = await Teacher.findOne({ userId: teacherUserId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 2️⃣ Find group assigned to this teacher
    const group = await Group.findOne({
      _id: id, // ✅ FIXED
      mentor: teacher._id,
    })
      .populate({
        path: "students",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("project");

    if (!group) {
      return res.status(404).json({
        message: "Group not found or not assigned to this teacher",
      });
    }

    // 3️⃣ Format students
    const students = group.students.map((s) => ({
      id: s._id,
      name: s.userId.name,
      email: s.userId.email,
      rollNo: s.rollNo,
      department: s.department,
      year: s.year,
      status: s.status,
    }));

    // 4️⃣ Project info
    const project = group.project
      ? {
        id: group.project._id,
        title: group.project.title,
        description: group.project.description,
        tech: group.project.tech,
        status: group.project.status,
        github: group.project.github,
        documentation: group.project.documentation,
        updatedAt: group.project.updatedAt,
      }
      : null;

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      group: {
        id: group._id,
        name: group.groupName,
        department: group.department,
        year: group.year,
        status: group.status,
      },
      students,
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

