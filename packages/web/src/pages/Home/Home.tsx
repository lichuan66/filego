import React, { useEffect, useState } from "react";
import { usePageType } from "../../hook/usePage";
import ButtonLayer from "./ButtonLayer";
import RouteLayer from "./RouteLayer";
import FilesLayer from "./FilesLayer";
import ListLayer from "./ListLayer";
import Header from "./Header";

export interface modeType {
  index: string;
  name: string;
  value: string;
  icon: any;
}

export default function Home() {
  const pageType = usePageType();
  const initIndex = pageType === "web" ? "1" : "2";
  const [modeTypeIndex, setModeTypeIndex] = useState(initIndex);

  // const duigouIconPath = require("@/assets/icons/duigou.svg");

  const modeTypeList: modeType[] = [
    {
      index: "1",
      name: "缩略模式",
      value: "suolue",
      icon: "a-teshuduihao",
    },
    {
      index: "2",
      name: "列表模式",
      value: "list",
      icon: "a-teshuduihao",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {pageType === "phone" && <Header />}
      {pageType === "web" && <ButtonLayer />}
      <RouteLayer
        modeTypeList={modeTypeList}
        modeTypeIndex={modeTypeIndex}
        setModeTypeIndex={setModeTypeIndex}
      />
      {modeTypeIndex === "1" && <FilesLayer />}
      {modeTypeIndex === "2" && <ListLayer />}
    </div>
  );
}
