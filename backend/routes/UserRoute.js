import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, getPublicStats } from "../controller/UserController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot password - send reset link
router.post("/forgot-password", forgotPassword);

// Reset password - set new password
router.post("/reset-password/:token", resetPassword);

// Public stats
router.get("/public-stats", getPublicStats);

export default router;
