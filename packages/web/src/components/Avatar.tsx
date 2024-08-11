import React from "react";

type Props = {
  src: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function Avatar({
  src,
  size = 60,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  return (
    <img
      className={className}
      style={{ width: size, height: size, borderRadius: "50%" }}
      src={src}
      alt=""
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
