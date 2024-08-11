import React, { useState, useEffect, useRef } from "react";
import Checkbox from "../../components/Checkbox";

type FileBoxProps = {
  name: string;
  type: string;
  updateTime: Date;
  size?: string;
};

function FilesLayer() {
  return (
    <div className="inline-block w-[120px] h-[130px] bg-slate-100 ml-[24px] mb-[32px]"></div>
  );
}

export default function FileList() {
  const fileList = [
    1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 2, 1, 1, 1, 11, 1, 11, 1, 1, 1, 1, 1,
    1, 11, 1, 1,
  ];

  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    const height = divRef.current.clientHeight;
    if (height) {
      setWinHeight(height);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="flex-1 w-full bg-red-300 rounded-bl-lg rounded-br-lg flex flex-col"
    >
      <div className="h-[30px] w-full">
        <label>
          <Checkbox />
          全选
        </label>
      </div>
      <div
        style={{ height: winHeight > 0 ? `${winHeight}px` : "" }}
        className={`w-full  overflow-y-auto `}
      >
        {winHeight &&
          fileList.map((elem) => {
            return <FilesLayer />;
          })}
      </div>
    </div>
  );
}
