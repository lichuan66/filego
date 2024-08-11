import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Content from "./Content";

export default function Layout() {
  return (
    <div className="h-full relative  flex bg-gradient-to-b from-purple-500 to-pink-500">
      <div className="w-[80px] h-full ">
        <Sidebar />
      </div>
      <div className="flex-1 h-full py-2 pr-2">
        <Content />
      </div>
    </div>
  );
}
