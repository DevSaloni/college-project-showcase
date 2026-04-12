import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

// create http server
const server = http.createServer(app);

// create socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room (group/project)
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log("User joined group:", groupId);
  });

  // join private room for personal notifications
  socket.on("joinUser", (userId) => {
    socket.join(userId);
    console.log("User joined private room:", userId);
  });

  // send message (flexible to include context/isDeleted/etc)
  socket.on("sendMessage", ({ groupId, message }) => {
    io.to(groupId).emit("receiveMessage", message);
  });


  // 1>typing features
  // user typing

  // typing
  socket.on("typing", ({ groupId, name }) => {
    socket.to(groupId).emit("userTyping", name);
  });

  // stop typing
  socket.on("stopTyping", (groupId) => {
    socket.to(groupId).emit("userStopTyping");
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 2021;

// routes
import UserRoute from "./routes/UserRoute.js";
import ProjectRoute from "./routes/ProjectRoute.js";
import ContactRoute from "./routes/ContactRoute.js";
import StudentRoute from "./routes/StudentRoute.js";
import TeacherRoute from "./routes/TeacherRoute.js";
import GroupRoute from "./routes/GroupRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import ProposalRoute from "./routes/ProposalRoute.js";
import DiscussionRoute from "./routes/DisscussionRoute.js";
import ProjectProgressRoute from "./routes/ProjectProgressRoute.js";
import NotificationRoute from "./routes/NotificationRoute.js";

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// mongodb connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB error", err);
  });

// routes
app.use("/api/auth", UserRoute);
app.use("/api/projects", ProjectRoute);
app.use("/api/contact", ContactRoute);
app.use("/api/student", StudentRoute);
app.use("/api/teacher", TeacherRoute);
app.use("/api/group", GroupRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/proposal", ProposalRoute);
app.use("/api/discussions", DiscussionRoute);
app.use("/api/progress", ProjectProgressRoute);
app.use("/api/notifications", NotificationRoute);

// start server
server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

export { io };