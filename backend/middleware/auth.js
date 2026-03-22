import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    console.log("AUTH HEADER:", req.headers.authorization); // 👈 ADD THIS

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

///teacher only validate proposal
export const teacherOnly = (req, res, next) => {
  if (req.user?.role === "teacher") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Teachers only.",
    });
  }
};

export const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access only" });
  }
  next();
};

