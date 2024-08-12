import React from "react";
import { Outlet } from "react-router-dom";

export default function Content() {
  return (
    <div className="w-full h-full bg-white rounded-lg">
      <Outlet />
    </div>
  );
}
