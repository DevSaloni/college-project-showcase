"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import BASE_URL from "@/config/api";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(BASE_URL.replace("/api", ""), {
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Join private room if user is logged in
    const userId = localStorage.getItem("userId");
    if (userId) {
      socketInstance.emit("joinUser", userId);
    }

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Update room joining when user logs in/out
  useEffect(() => {
    if (!socket) return;

    const handleLoginStatus = () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        socket.emit("joinUser", userId);
      }
    };

    window.addEventListener("login-status", handleLoginStatus);
    return () => window.removeEventListener("login-status", handleLoginStatus);
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
