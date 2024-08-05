import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/LoginSignup/Login.tsx";
import Register from "@/pages/LoginSignup/Register.tsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </div>
  );
}
