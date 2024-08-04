import React from "react";
import { Routes, Route } from "react-router-dom";
import Base from "@/pages/LoginSignup/Base.tsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Base />}></Route>
      </Routes>
    </div>
  );
}
