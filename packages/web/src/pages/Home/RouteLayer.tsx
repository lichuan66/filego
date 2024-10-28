import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Dropdown from "../../components/Dropdown";
import { Menu, MenuItem } from "../../components/Menu";
import IconButton from "../../components/IconButton";
import { useFileRoute } from "../../hook/useFile";
import { usePageType } from "../../hook/usePage";
import type { modeType } from "./Home";

interface MenuInfo {
  key: string;
  keyPath?: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item?: React.ReactInstance;
  domEvent?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

type Props = {
  modeTypeList: modeType[];
  modeTypeIndex: string;
  setModeTypeIndex: (val: string) => void;
};

export default function RouteLayer({
  modeTypeList,
  modeTypeIndex,
  setModeTypeIndex,
}: Props) {
  const fileRoute = useFileRoute();
  const pageType = usePageType();

  const changeModeType = function ({ key }: MenuInfo) {
    setModeTypeIndex(key);
  };

  const menu = (
    <Menu className="">
      {modeTypeList.map((elem) => {
        return (
          <MenuItem key={elem.index} onClick={changeModeType}>
            <div className="bg-white md:hover:bg-sky-100 px-6 py-2 flex flex-row justify-center items-center  cursor-pointer">
              <i
                className="iconfont icon-a-teshuduihao text-blue-500"
                style={{
                  fontSize: "14px",
                  visibility:
                    modeTypeIndex === elem.index ? "visible" : "hidden",
                }}
              ></i>
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
        <Breadcrumb items={fileRoute} />
      </div>
      {pageType === "web" && (
        <div>
          <Dropdown
            trigger={["hover"]}
            overlay={menu}
            animation="slide-up"
            alignPoint
          >
            <button>
              <IconButton
                icon={"a-teshushouqi"}
                width={18}
                height={18}
                iconSize={18}
                className="cursor-pointer"
              />
            </button>
          </Dropdown>
        </div>
      )}
    </div>
  );
}
