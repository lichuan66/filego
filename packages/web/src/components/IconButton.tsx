import React from "react";
import { cn } from "../lib/utils";

type Props = {
  width: number;
  height: number;
  icon: string;
  iconSize: number;
  className?: string;
  style?: Object;
  iconColor?: string;
  onClick?: (val: any) => void;
};

export default function IconButton({
  width,
  height,
  icon,
  iconSize = 30,
  className,
  style,
  iconColor = "black",
  onClick = () => {},
}: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(`text-center block`, className)}
      style={{ width, height, ...style }}
    >
      {/* <img src={icon} style={{ width, height, lineHeight: `${height}px` }} /> */}
      <i
        className={`iconfont icon-${icon}  `}
        style={{
          lineHeight: `${height}px`,
          fontSize: iconSize,
          color: iconColor,
        }}
      ></i>
    </div>
  );
}
