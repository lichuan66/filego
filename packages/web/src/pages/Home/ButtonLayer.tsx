import React, { useState } from "react";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";

export default function ButtonLayer() {
  const uploadIconPath = require("@/assets/icons/shangchuan.svg");
  const xinjianIconPath = require("@/assets/icons/xinjian.svg");

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="h-16 w-full   rounded-tl-lg rounded-tr-lg flex flex-row justify-between">
      <div className="h-full w-full flex flex-row items-center px-2">
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
      <div className="flex justify-center items-center px-2 ">
        <Input
          className=""
          inputClassName="border-2 border-sky-400 text-[12px] rounded-tr-none rounded-br-none"
          placeholder="搜索我的文件"
          value={searchValue}
          iconSize={10}
          iconClassName="md:hover:bg-white"
          onChange={setSearchValue}
        />
        <Button className="h-[32px] w-[60px] px-1 text-[10px] rounded-tr-lg rounded-br-lg">
          搜索
        </Button>
      </div>
    </div>
  );
}
