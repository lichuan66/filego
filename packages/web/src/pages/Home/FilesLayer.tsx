import React, { useState, useEffect, useRef } from "react";
import Checkbox from "../../components/Checkbox";
import IconButton from "../../components/IconButton";

type FileBoxProps = {
  name: string;
  type: string;
  updateTime: string;
  size: string;
  iconPath: string;
};

function FilesLayer({ name, type, updateTime, size, iconPath }: FileBoxProps) {
  const fenxiangIconPath = require("@/assets/icons/fenxiang.svg");
  const xiazaiIconPath = require("@/assets/icons/xiazai.svg");
  const bluemoreIconPath = require("@/assets/icons/bluemore.svg");

  const boxSettingList = [
    {
      index: 1,
      name: "分享",
      icon: fenxiangIconPath,
    },
    {
      index: 2,
      name: "下载",
      icon: xiazaiIconPath,
    },
    {
      index: 3,
      name: "更多",
      icon: bluemoreIconPath,
    },
  ];

  return (
    <div className=" group inline-block rounded-lg w-[120px] h-[150px] bg-white hover:bg-sky-200/30 ml-[24px] mb-[32px] md:hover:bg-sky-200/30 cursor-pointer">
      <div className="relative  w-full h-full flex flex-col">
        <div className="h-[20px] w-full invisible group-hover:visible">
          <div className=" pt-2  h-[20px] w-full px-1 flex flex-row justify-between">
            <label className="mt-[-5px]">
              <Checkbox />
            </label>
            <div className="flex felx-row justify-center items-center">
              {boxSettingList.map((elem, id) => {
                return (
                  <IconButton
                    key={id}
                    icon={elem.icon}
                    width={20}
                    height={20}
                    iconSize={20}
                    className="mx-[1px]"
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div>
            <IconButton icon={iconPath} width={60} height={60} iconSize={60} />
          </div>
          <div>
            <span className="text-xs font-semibold">{name}</span>
          </div>
          <div className="mt-[-6px]">
            <span className="text-xs text-gray-500">
              {type === "folder" ? updateTime : size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FileList() {
  const wenjianjiaIconPath = require("@/assets/icons/wenjianjia.svg");
  const tupianIconPath = require("@/assets/icons/tupian.svg");
  const pdfIconPath = require("@/assets/icons/pdf.svg");
  const zipIconPath = require("@/assets/icons/zip.svg");

  const fileList = [
    {
      index: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      index: 2,
      name: "图片",
      type: "image",
      updateTime: "08-10 17:05",
      size: "20m",
      iconPath: tupianIconPath,
    },
    {
      index: 3,
      name: "pdf",
      type: "pdf",
      updateTime: "08-10 17:05",
      size: "33k",
      iconPath: pdfIconPath,
    },
    {
      index: 4,
      name: "压缩包",
      type: "zip",
      updateTime: "08-10 17:05",
      size: "33k",
      iconPath: zipIconPath,
    },
  ];

  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    const height = divRef.current.clientHeight - 80;
    if (height) {
      setWinHeight(height);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="flex-1 w-full  rounded-bl-lg rounded-br-lg flex flex-col"
    >
      <div className="h-[80px] w-full pl-5  flex items-center">
        <label className="flex flex-row items-center">
          <Checkbox />
          <span className="ml-2 text-xs">全选</span>
        </label>
      </div>
      <div
        style={{ height: winHeight > 0 ? `${winHeight}px` : "" }}
        className={`w-full  overflow-y-auto `}
      >
        {winHeight &&
          fileList.map((elem, id) => {
            return (
              <FilesLayer
                key={id}
                name={elem.name}
                size={elem.size}
                type={elem.type}
                updateTime={elem.updateTime}
                iconPath={elem.iconPath}
              />
            );
          })}
      </div>
    </div>
  );
}
