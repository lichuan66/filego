import React, { useState, useEffect, useRef } from "react";
import Checkbox from "../../components/Checkbox";
import { useFileRoute, useFileList } from "../../hook/useFile";
import useAction from "../../hook/useAction";
import getFileListHandler from "../../lib/getFileList";
import Window from "../../components/Window";
import FileBox from "./FileBox";

export default function FilesLayer() {
  const fileList = useFileList();
  const fileRoute = useFileRoute();
  const { setFileList } = useAction();

  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    getFileListHandler(fileRoute, setFileList);
  }, [fileRoute]);

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
          fileList.map((elem: any, id: any) => {
            return (
              <FileBox
                key={elem.name}
                name={elem.name}
                size={elem.size}
                type={elem.type}
                updateTime={elem.updateTime}
                iconPath={elem.iconPath}
                suolueStatus={elem.suolueStatus}
              />
            );
          })}
      </div>
    </div>
  );
}
