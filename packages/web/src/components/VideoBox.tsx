import React, { useEffect, useRef, useState } from "react";
import { useFileRoute } from "../hook/useFile";
import { readVideo } from "../api/fileManager";
import config from "@filego/config/client";
import { getToken } from "../api/auth";

type VideoBoxProps = {
  name: string;
};

export default function VideoBox({ name }: VideoBoxProps) {
  const fileRoute = useFileRoute();
  const route = fileRoute[fileRoute.length - 1].href;

  const [url, setUrl] = useState("");
  const divRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const userApi = `http://${config.Server}/api/fileManager`;
    const tempUrl = `${userApi}/readVideo?route=${route}&username=${getToken()}&fileName=${name}`;
    setUrl(tempUrl);
  }, []);

  useEffect(() => {
    console.log(111, divRef.current, videoRef.current);

    if (divRef.current && videoRef.current) {
      console.log(222);

      // 创建一个ResizeObserver实例
      const resizeObserver = new ResizeObserver((entries) => {
        // 当观察到尺寸变化时调用的回调函数
        entries.forEach((entry) => {
          // 更新canvas的尺寸
          // @ts-ignore
          videoRef.current.width = entry.contentRect.width;
          // @ts-ignore
          videoRef.current.height = entry.contentRect.height;
        });
      });

      // 开始观察divRef所指向的元素
      resizeObserver.observe(divRef.current);

      // 清理工作
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [url]); // 空数组依赖意味着这个effect只会在组件挂载时运行一次

  return (
    <div className="w-full h-full" ref={divRef}>
      {url && (
        <video width="320" height="240" controls ref={videoRef}>
          <source src={url} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
