import React, { useState } from "react";
import ReactDOM from "react-dom";
import config from "@filego/config/client";
import Window from "../../../../components/Window";
import ImageBox from "../../../../components/ImageBox";

interface ImageMessageProps {
  src: string;
  //   loading: boolean;
  //   percent: number;
}

export default function ImageMessage(props: ImageMessageProps) {
  const { src } = props;

  const [isOpenWindow, setIsOpenWindow] = useState(false);

  const width = 200;
  const height = 200;

  const imageSrc = /^(blob|data):/.test(src)
    ? src
    : `http://${config.ServerPublic}${src}`;

  return (
    <>
      <div>
        <img
          onClick={() => setIsOpenWindow(true)}
          className="max-w-[500px] max-h-[500px] border rounded-lg cursor-pointer"
          src={imageSrc}
          alt="消息图片"
          width={width}
          height={height}
        />
      </div>
      {isOpenWindow &&
        ReactDOM.createPortal(
          <Window
            full={false}
            title={""}
            isOpen={isOpenWindow}
            onClose={setIsOpenWindow}
          >
            {<ImageBox name={imageSrc} type={"message"} />}
          </Window>,
          document.body
        )}
    </>
  );
}
