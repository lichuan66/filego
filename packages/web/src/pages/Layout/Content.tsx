import React from "react";
import { Outlet } from "react-router-dom";
import useAction from "../../hook/useAction";
import { useSiderBarOpen } from "../../hook/usePage";

export default function Content() {
  const { setSiderBarOpen } = useAction();
  const siderBarOpen = useSiderBarOpen();

  function clearSiderBar() {
    if (siderBarOpen) {
      setSiderBarOpen(false);
    }
  }

  return (
    <div onClick={clearSiderBar} className="w-full h-full bg-white rounded-lg">
      <Outlet />
    </div>
  );
}
