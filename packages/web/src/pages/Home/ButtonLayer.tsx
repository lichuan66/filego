import React from "react";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";

export default function ButtonLayer() {
  const uploadIconPath = require("@/assets/icons/shangchuan.svg");
  const xinjianIconPath = require("@/assets/icons/xinjian.svg");

  return (
    <div className="h-16 w-full  flex flex-row items-center rounded-tl-lg rounded-tr-lg px-2">
      <Button className="md:hover:bg-sky-400 rounded-2xl bg-sky-400 w-24 font-custom py-[2px]">
        <div className="flex flex-row items-center justify-center">
          <IconButton
            icon={uploadIconPath}
            width={18}
            height={18}
            iconSize={18}
          />
          <span className="text-[14px] ml-1">上传</span>
        </div>
      </Button>
      <Button className="ml-3 md:hover:bg-sky-400/30 rounded-2xl bg-sky-300/10 w-30 font-custom py-[2px] text-blue-600">
        <div className="flex flex-row items-center justify-center">
          <IconButton
            icon={xinjianIconPath}
            width={18}
            height={18}
            iconSize={18}
          />
          <span className="text-[14px] ml-1">新建文件夹</span>
        </div>
      </Button>
    </div>
  );
}
