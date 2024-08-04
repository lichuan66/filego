import React from "react";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";

export default function Base() {
  const iconPath = require("@/assets/icons/caozuo.svg");

  return (
    <div className="min-h-screen bg-rose-500 flex justify-center items-center">
      <div className="w-[300px] h-[300px] bg-white rounded-lg md:w-[800px] md:h-[600px]">
        <Button
          onClick={() => {
            console.log(11111);
          }}
        >
          登陆
        </Button>
        <IconButton width={32} height={32} icon={iconPath} iconSize={27} />
      </div>
    </div>
  );
}
