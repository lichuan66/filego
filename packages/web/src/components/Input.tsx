import React, { useEffect, useState } from "react";
import IconButton from "./IconButton";
import { cn } from "../lib/utils";
import { useRef } from "react";

type InputProps = {
  value?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onChange: (value: string) => void;
  onEnter?: (value: string) => void;
  onFocus?: () => void;
};

export default function Input({
  value = "",
  type = "text",
  placeholder = "",
  className = "",
  inputClassName = "",
  onChange,
  onEnter = () => {},
  onFocus = () => {},
}: InputProps) {
  const iconPath = require("@/assets/icons/guanbi.svg");

  const $input = useRef(null);

  function handleInput(e: any) {
    onChange(e.target.value);
  }

  function handleClickClear() {
    onChange("");
    // @ts-ignore
    $input.current.focus();
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      // @ts-ignore
      $input.current.blur();
    }
  }

  return (
    <div className={cn(`relative h-[32px] min-h-[32px]`, className)}>
      <input
        className={cn(
          `w-full h-full 
        rounded-md border border-solid
         border-black text-gray-600 
         box-border px-[15px]`,
          inputClassName
        )}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={handleInput}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        ref={$input}
      />
      <IconButton
        className="absolute top-0 bottom-0 right-[10px] m-auto
         rounded-[50%] bg-white border border-[#ccc] flex 
         justify-center items-center hover:bg-[#ccc] cursor-pointer"
        style={{ width: "35px", height: "35px", display: value ? "" : "none" }}
        icon={iconPath}
        width={20}
        height={20}
        iconSize={20}
        onClick={handleClickClear}
      />
    </div>
  );
}
