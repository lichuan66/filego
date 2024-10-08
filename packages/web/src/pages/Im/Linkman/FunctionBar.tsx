import React from "react";
import Input from "../../../components/Input";
import IconButton from "../../../components/IconButton";

export default function FunctionBar() {
  const placeholder = "搜索群组/用户";
  const addIcon = require("../../../assets/icons/add.svg");

  return (
    <div className="w-full flex flex-row gap-2 justify-center p-2 py-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-center items-center w-[100%]"
      >
        <Input placeholder={placeholder} onChange={() => {}} />
      </form>
      <IconButton
        icon={addIcon}
        width={48}
        height={48}
        iconSize={48}
        className="cursor-pointer  opacity-100 hover:opacity-40"
      />
    </div>
  );
}
