import React, { useEffect, useRef, useState } from "react";
import getBorderScale from "../lib/getBorderScale";
import config from "@filego/config/client";
import { getToken } from "@/api/auth";
import { useFileRoute } from "../hook/useFile";
import Loading from "./Loading";

type ImageBoxProps = {
  // src: string;
  name: string;
};

export default function ImageBox({ name }: ImageBoxProps) {
  const divRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const fileRoute = useFileRoute();

  const route = fileRoute[fileRoute.length - 1].href;
  const userApi = `http://${config.Server}/api/fileManager`;
  const src = `${userApi}/readImg?route=${route}&fileName=${name}&username=${getToken()}`;

  /** 绘制 */
  function loadImg() {
    const canvas = document.getElementById(`myCanvas_${name}`);

    if (canvas) {
      // @ts-ignore
      const ctx = canvas?.getContext("2d");

      // 创建一个新的Image对象
      // @ts-ignore
      const img = new Image();
      // 设置图片源
      img.src = src || `http://${config.Server}/avatar/0.jpg`;
      img.crossOrigin = "";

      // 监听图片加载完成的事件
      img.onload = function () {
        setLoading(false);

        // 使用drawImage方法将图片绘制到canvas上
        const borderWidth = canvas?.clientWidth;
        const borderHeight = canvas?.clientHeight;

        const scale = getBorderScale(
          borderWidth,
          borderHeight,
          img.width,
          img.height
        );

        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;

        const offsetX = Number(((borderWidth - imgWidth) / 2).toFixed(3));
        const offsetY = Number(((borderHeight - imgHeight) / 2).toFixed(3));

        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          img.width * scale,
          img.height * scale
        ); // 可以调整参数来控制绘制的位置和大小

        canvas.style.backgroundColor = "rgba(0,0,0,0.8)";
      };
    }
  }

  useEffect(() => {
    if (divRef.current && canvasRef.current) {
      // 创建一个ResizeObserver实例
      const resizeObserver = new ResizeObserver((entries) => {
        // 当观察到尺寸变化时调用的回调函数
        entries.forEach((entry) => {
          // 更新canvas的尺寸
          // @ts-ignore
          canvasRef.current.width = entry.contentRect.width;
          // @ts-ignore
          canvasRef.current.height = entry.contentRect.height;

          loadImg();
        });
      });

      // 开始观察divRef所指向的元素
      resizeObserver.observe(divRef.current);

      // 清理工作
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []); // 空数组依赖意味着这个effect只会在组件挂载时运行一次

  return (
    <div className="w-full h-full" ref={divRef}>
      {loading && <Loading />}
      <canvas id={`myCanvas_${name}`} ref={canvasRef}></canvas>
    </div>
  );
}
