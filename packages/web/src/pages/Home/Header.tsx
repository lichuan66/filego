import React from "react";
import Avatar from "../../components/Avatar";
import { useSiderBarOpen } from "../../hook/usePage";
import useAction from "../../hook/useAction";

export default function Header() {
  const avatarPath = require("@/assets/avatar/0.jpg");
  const siderBarOpen = useSiderBarOpen();
  const { setSiderBarOpen } = useAction();

  function clickAvater() {
    setSiderBarOpen(!siderBarOpen);
  }

  return (
    <div
      onClick={clickAvater}
      className="w-full h-14 bg-slate-100 rounded-tl-lg rounded-tr-lg"
    >
      <div className="relative w-full h-full flex flex-row items-center justify-center">
        {!siderBarOpen && (
          <Avatar
            src={avatarPath}
            className="cursor-pointer absolute left-3"
            onClick={() => {}}
            size={45}
          />
        )}
        <div>
          <span className="font-bold text-3xl ">Filego</span>
        </div>
      </div>
    </div>
  );
}
