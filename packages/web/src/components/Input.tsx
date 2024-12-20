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
  iconSize?: number;
  iconClassName?: string;
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
  iconSize = 35,
  iconClassName = "",
  onChange,
  onEnter = () => {},
  onFocus = () => {},
}: InputProps) {
  // const iconPath = require("@/assets/icons/guanbi.svg");

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
      // $input.current.blur();
      onEnter(value as string);
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
        onFocus={onFocus}
      />
      <IconButton
        className={cn(
          `absolute top-0 bottom-0 right-[10px] m-auto
         rounded-[50%] bg-white  flex 
         justify-center items-center hover:bg-[#ccc] cursor-pointer`,
          iconClassName
        )}
        // style={{
        //   width: `${iconSize}px`,
        //   height: `${iconSize}px`,
        //   display: value ? "" : "none",
        // }}
        icon={"a-teshuguanbi"}
        width={15}
        height={15}
        iconSize={15}
        onClick={handleClickClear}
      />
    </div>
  );
}
