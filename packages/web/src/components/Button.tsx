import React from "react";
import { cn } from "@/lib/utils.ts";

type Props = {
  type?: string;
  children?: any;
  className?: string;
  onClick?: () => void;
};

export default function Button({
  type = "primary",
  children,
  className,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        ` bg-sky-500
       text-white font-bold text-xl 
       px-3 py-1
        min-w-6 min-h-10
       md:hover:bg-sky-700`,
        type,
        className
      )}
    >
      {children}
    </button>
  );
}
