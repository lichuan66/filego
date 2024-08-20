import React from "react";
import Avatar from "../../components/Avatar";
import { useSiderBarOpen } from "../../hook/usePage";
import useAction from "../../hook/useAction";
import { useAvatar } from "../../hook/useUser";
import config from "@filego/config/client";

export default function Header() {
  const avatarPath = require("@/assets/avatar/0.jpg");
  const siderBarOpen = useSiderBarOpen();
  const { setSiderBarOpen } = useAction();
  const avatar = useAvatar();
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
            src={`http://${config.Server}${avatar}`}
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
