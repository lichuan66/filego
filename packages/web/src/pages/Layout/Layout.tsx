import React from "react";
import Sidebar from "./SideBar";
import Content from "./Content";
import { useSiderBarOpen, usePageType } from "../../hook/usePage";

export default function Layout() {
  const siderBarOpen = useSiderBarOpen();
  const pageType = usePageType();

  return (
    <div className="h-full relative  flex bg-gradient-to-b from-purple-500 to-pink-500">
      {(siderBarOpen || pageType === "web") && (
        <div className=" w-[80px] h-full block transition-all duration-3000">
          <Sidebar />
        </div>
      )}
      <div className="flex-1 h-full py-2 pr-2 pl-2 md:pl-2 flex flex-col transition-all duration-3000">
        <Content />
      </div>
    </div>
  );
}
