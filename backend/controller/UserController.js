import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";


// Function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//register user 
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

//login user 
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};


//forgot  password 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not Found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "94b204001@smtp-brevo.com",
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    await transporter.sendMail({
      from: `"Saloni" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Password Reset Link",
      html: `
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `,
    });

    res.json({ message: "Reset link sent to your email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending reset email" });
  }
};


//reset password
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decode.id, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Public stats for contact/landing page
export const getPublicStats = async (req, res) => {
  try {
    // Count ONLY students from User collection
    const studentCount = await User.countDocuments({ role: 'student' });

    // Fetch ONLY sample profiles from Student collection
    const sampleStudents = await Student.find({}, 'image userId').limit(5).populate('userId', 'name');

    let profiles = sampleStudents;
    
    // Fallback: If no profile documents exist yet, get student names from User collection
    if (profiles.length === 0) {
      const fallbackUsers = await User.find({ role: 'student' }, 'name').limit(5);
      profiles = fallbackUsers.map(u => ({ userId: { name: u.name } }));
    }

    res.json({
      success: true,
      totalCount: studentCount,
      profiles: profiles
    });
  } catch (error) {
    console.error("Public stats error:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};
