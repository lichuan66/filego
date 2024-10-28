import React, { useState } from "react";
import ReactDOM from "react-dom";
import config from "@filego/config/client";
import Window from "../../../../components/Window";
import PdfBox from "../../../../components/PdfBox";
import TextBox from "../../../../components/TextBox";

type FileMessage = {
  file: string;
  percent: number;
};

export default function FileMessage({ file, percent }: FileMessage) {
  const { fileUrl, filename, size } = JSON.parse(file);
  console.log(`http://${config.ServerPublic}${fileUrl}`);

  const url = `http://${config.ServerPublic}${fileUrl}`;

  const [isOpenWindow, setIsOpenWindow] = useState(false);

  return (
    <>
      <div
        className="block min-w-[160px] max-w-[240px] py-0 px-[4px] cursor-pointer text-center text-green-950"
        onClick={() => setIsOpenWindow(true)}
      >
        <div className="flex flex-col justify-center items-center border-b border-b-[#eee]">
          <span>{filename}</span>
          <span>{size}</span>
        </div>
        <p className="inline-block text-center mt-[6px]">
          {percent === undefined || percent >= 100
            ? "下载"
            : `上传中... ${percent.toFixed(0)}%`}
        </p>
      </div>
      {isOpenWindow &&
        ReactDOM.createPortal(
          <Window
            full={false}
            title={""}
            isOpen={isOpenWindow}
            onClose={setIsOpenWindow}
          >
            {/\.txt$/i.test(filename) && (
              <TextBox name={url} type={"message"} />
            )}
            {/\.pdf$/i.test(filename) && <PdfBox name={url} />}
          </Window>,
          document.body
        )}
    </>
  );
}
