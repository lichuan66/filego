import React from "react";
import IconButton from "../../../components/IconButton";

type PropsType = {
  name: string;
  id: string;
  type: string;
  onlineMembersCount?: number;
  isOnline?: boolean;
};

export default function HeaderBar(props: PropsType) {
  const { id, name, type, onlineMembersCount, isOnline } = props;

  // const shareIcons = require("../../../assets/icons/share.svg");
  // const gongnengIcons = require("../../../assets/icons/gongneng.svg");

  return (
    <div className="w-full h-[70px] px-4 flex flex-row justify-between items-center">
      <h2>
        {name && (
          <span>
            {name}
            {"  "}
            {onlineMembersCount !== undefined && (
              <b>{`(${onlineMembersCount})`}</b>
            )}
            {isOnline !== undefined && (
              <b>{`(${isOnline ? "在线" : "离线"})`}</b>
            )}
          </span>
        )}
      </h2>
      {
        <div className="flex flex-row justify-between items-center gap-3">
          <IconButton
            icon={"JC_054"}
            width={28}
            height={28}
            iconSize={28}
            iconColor="#60a5fa"
            className="cursor-pointer  opacity-100 hover:opacity-40"
          />
          <IconButton
            icon={"zuocedaohangcaidan-caidanhuizong"}
            width={28}
            height={28}
            iconSize={28}
            iconColor="#60a5fa"
            className="cursor-pointer  opacity-100 hover:opacity-40"
          />
        </div>
      }
    </div>
  );
}
