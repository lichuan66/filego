import React from "react";
import { Outlet } from "react-router-dom";

export default function Content() {
  return (
    <div className="w-full h-full bg-slate-100 rounded-lg">
      <Outlet />
    </div>
  );
}
