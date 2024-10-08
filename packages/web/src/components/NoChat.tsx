import React from "react";
import IconButton from "./IconButton";

export default function Loading() {
  const noChatIcon = require("../assets/icons/noChat.svg");

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0  flex flex-col justify-center items-center">
      <IconButton
        icon={noChatIcon}
        width={80}
        height={80}
        iconSize={80}
        className="mx-[1px]"
      />
      <span className="text-[18px] font-bold mt-3">当前内容为空</span>
    </div>
  );
}
