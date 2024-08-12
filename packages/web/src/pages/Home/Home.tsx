import React, { useState } from "react";
import ButtonLayer from "./ButtonLayer";
import RouteLayer, { modeType } from "./RouteLayer";
import FilesLayer from "./FilesLayer";
import ListLayer from "./ListLayer";

export default function Home() {
  const [modeTypeIndex, setModeTypeIndex] = useState("1");

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
      <ButtonLayer />
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
