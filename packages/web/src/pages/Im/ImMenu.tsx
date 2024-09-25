import React from "react";
import { Menu, MenuItem } from "../../components/Menu";
import IconButton from "../../components/IconButton";

type ImMenuProps = {
  imMenuIndex: number;
  setImMenuIndex: (val: number) => void;
};

export default function ImMenu({ imMenuIndex, setImMenuIndex }: ImMenuProps) {
  const messageIconPath = require("@/assets/icons/message.svg");
  const tongxunluIconPath = require("@/assets/icons/tongxunlu.svg");

  const imMenuContent = [
    {
      index: 1,
      label: "会话",
      icon: messageIconPath,
    },
    {
      index: 2,
      label: "通讯录",
      icon: tongxunluIconPath,
    },
  ];

  return (
    <div className="w-full h-full p-2">
      <Menu className="border-none shadow-none">
        {imMenuContent.map((elem) => {
          return (
            <MenuItem className="rounded-lg" style={{ padding: 0 }}>
              <div
                className={`
                cursor-pointer font-bold py-2 pl-6 text-[14px] flex flex-row items-center`}
                onClick={() => setImMenuIndex(elem.index)}
              >
                <IconButton
                  icon={elem.icon}
                  width={14}
                  height={14}
                  iconSize={14}
                />
                <span
                  className={`${
                    imMenuIndex === elem.index ? "text-blue-400" : ""
                  } ml-2`}
                >
                  {elem.label}
                </span>
              </div>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
