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
  console.log(111111);

  const pageType = usePageType();
  const [modeTypeIndex, setModeTypeIndex] = useState("1");

  const duigouIconPath = require("@/assets/icons/duigou.svg");

  const modeTypeList: modeType[] = [
    {
      index: "1",
      name: "缩略模式",
      value: "suolue",
      icon: duigouIconPath,
    },
    {
      index: "2",
      name: "列表模式",
      value: "list",
      icon: duigouIconPath,
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
