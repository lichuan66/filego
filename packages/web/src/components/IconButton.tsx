import React from "react";
import { cn } from "../lib/utils";

type Props = {
  width: number;
  height: number;
  icon: string;
  iconSize: number;
  className?: string;
  style?: Object;
  onClick?: (val: any) => void;
};

export default function IconButton({
  width,
  height,
  icon,
  iconSize,
  className,
  style,
  onClick = () => {},
}: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(``, className)}
      style={{ width, height, ...style }}
    >
      <img src={icon} style={{ width, height, lineHeight: `${height}px` }} />
    </div>
  );
}
