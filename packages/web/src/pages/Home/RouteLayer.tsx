import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Dropdown from "../../components/Dropdown";
import { Menu, MenuItem } from "../../components/Menu";
import IconButton from "../../components/IconButton";

interface MenuInfo {
  key: string;
  keyPath?: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item?: React.ReactInstance;
  domEvent?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export default function RouteLayer() {
  const moshiIconPath = require("@/assets/icons/moshi.svg");
  const duigouIconPath = require("@/assets/icons/duigou.svg");

  const routeList = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    { label: "Subcategory", href: "/subcategory" },
    { label: "Current Page", href: "" }, // 最后一项通常没有链接
  ];

  const modeTypeList = [
    {
      index: "1",
      name: "列表模式",
    },
    {
      index: "2",
      name: "缩略模式",
    },
  ];

  const [modeTypeIndex, setModeTypeIndex] = useState("1");

  const changeModeType = function ({ key }: MenuInfo) {
    setModeTypeIndex(key);
  };

  const menu = (
    <Menu className="">
      {modeTypeList.map((elem) => {
        return (
          <MenuItem key={elem.index} onClick={changeModeType}>
            <div className="bg-white md:hover:bg-sky-100 px-6 py-2 flex flex-row justify-center items-center  cursor-pointer">
              <IconButton
                icon={duigouIconPath}
                width={12}
                height={12}
                iconSize={12}
                className={`${modeTypeIndex === elem.index ? "" : "invisible"}`}
              />
              <span
                className={`ml-1 ${
                  modeTypeIndex === elem.index ? "text-[#1296db]" : ""
                }  `}
              >
                {elem.name}
              </span>
            </div>
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <div className="w-full h-10  flex flex-row items-center justify-between px-2">
      <div>
        <Breadcrumb items={routeList} />
      </div>
      <div>
        <Dropdown
          trigger={["click"]}
          overlay={menu}
          animation="slide-up"
          alignPoint
        >
          <IconButton
            icon={moshiIconPath}
            width={18}
            height={18}
            iconSize={18}
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </div>
  );
}
