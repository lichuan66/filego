import React, { useEffect } from "react";
import getBorderScale from "../lib/getBorderScale";
import config from "@filego/config/client";

type ImageBoxProps = {
  src: string;
};

export default function ImageBox({ src }: ImageBoxProps) {
  useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    // @ts-ignore
    const ctx = canvas?.getContext("2d");

    // 创建一个新的Image对象
    // @ts-ignore
    const img = new Image();
    // 设置图片源
    img.src = src || `http://${config.Server}/avatar/0.jpg`;

    // 监听图片加载完成的事件
    img.onload = function () {
      // 使用drawImage方法将图片绘制到canvas上

      ctx.drawImage(img, 0, 0, img.width, img.height); // 可以调整参数来控制绘制的位置和大小
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas id="myCanvas" className="w-full h-full"></canvas>
    </div>
  );
}
