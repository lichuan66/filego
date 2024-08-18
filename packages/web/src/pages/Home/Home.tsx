import React, { useState } from "react";
import { usePageType } from "../../hook/usePage";
import ButtonLayer from "./ButtonLayer";
import RouteLayer, { modeType } from "./RouteLayer";
import FilesLayer from "./FilesLayer";
import ListLayer from "./ListLayer";
import Header from "./Header";

export default function Home() {
  const pageType = usePageType();

  const [modeTypeIndex, setModeTypeIndex] = useState("2");

  const modeTypeList: modeType[] = [
    {
      index: "1",
      name: "缩略模式",
      value: "suolue",
    },
    {
      index: "2",
      name: "列表模式",
      value: "list",
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
