import Group from "../models/Groups.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Project from "../models/ProjectCreate.js";
import ProjectInitial from "../models/ProjectCreate.js";
import ProjectProgress from "../models/ProjectProgress.js";

export const createGroup = async (req, res) => {
  try {
    const { groupName, department, year, mentor, students, status, project, groupSize } = req.body;

    const exists = await Group.findOne({ groupName });
    if (exists) {
      return res.status(400).json({ message: "Group already exists" });
    }

    // ❌ student count mismatch
    if (students.length !== Number(groupSize)) {
      return res.status(400).json({
        message: `Please select exactly ${groupSize} students`
      });
    }



    // students MUST be array of ObjectIds
    const group = await Group.create({
      groupName,
      department,
      year,
      mentor,          // ObjectId
      students,        // ObjectId[]
      status,
      project,
      groupSize
    });

    await Student.updateMany(
      { _id: { $in: students } },
      { $set: { assignedToGroup: true } }
    );

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create group" });
  }
};


/* ================= GET ALL GROUPS ================= */


export const getAllGroups = async (req, res) => {
  try {
    // 1️⃣ Fetch valid groups (with mentor & students)
    const groups = await Group.find({
      mentor: { $ne: null },
      students: { $not: { $size: 0 } },
    })
      .populate({
        path: "mentor",
        populate: { path: "userId", select: "name email" },
      })
      .populate("students", "name rollNo")
      .sort({ createdAt: -1 });

    // 2️⃣ Attach project to each group
    const groupsWithProjects = await Promise.all(
      groups.map(async (group) => {
        const project = await Project.findOne({ groupId: group._id }, "title status");
        return {
          ...group.toObject(),
          project,
        };
      })
    );

    res.status(200).json({
      success: true,
      groups: groupsWithProjects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};
//get groups by id
export const getGroupsById = async (req, res) => {
  try {
    // 1️⃣ Fetch group with mentor and students populated
    const group = await Group.findById(req.params.id)
      .populate({
        path: "mentor",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "students",
        select: "rollNo",
        populate: { path: "userId", select: "name" },
      });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // 2️⃣ Fetch project assigned to this group
    const project = await ProjectInitial.findOne({ groupId: group._id })
      .populate("mentorId", "userId") // optional: populate mentor
      .populate("proposalId"); // optional: populate proposal if needed

    // 3️⃣ Fetch milestones for this group/project
    let milestones = [];
    if (project) {
      milestones = await ProjectProgress.find({ groupId: group._id })
        .populate("studentId", "name")  // get student names
        .populate("mentorId", "userId") // get mentor info
        .select("milestones studentId mentorId progressPercent");
    }

    // 4️⃣ Return everything in one object
    res.status(200).json({
      ...group.toObject(),
      project,
      milestones,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//get all group by teachers id 

export const getMentorGroupsWithStudents = async (req, res) => {
  try {
    const { mentorId } = req.params; // this IS Teacher._id

    const groups = await Group.find({ mentor: mentorId })
      .populate({
        path: "students",
        select: "rollNo department year status userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "mentor",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("project", "title");

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.error("Mentor groups error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor groups",
    });
  }
};


//get group by student id for student dash to submit proposal
export const getGroupByStudent = async (req, res) => {
  try {
    // ✅ Fix: use id instead of _id
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const group = await Group.findOne({
      students: student._id,
    }).populate({
      path: "mentor",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "No group assigned to this student",
      });
    }

    res.status(200).json({
      success: true,
      group: {
        _id: group._id,
        groupName: group.groupName,
        department: group.department,
        year: group.year,
        semester: student.sem,
        mentorName: group.mentor?.userId?.name || "Not Assigned",
        mentorId: group.mentor?._id || null,
      },
    });

  } catch (error) {
    console.error("Get Group By Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


