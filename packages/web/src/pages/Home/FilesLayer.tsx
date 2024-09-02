import React, { useState, useEffect, useRef } from "react";
import Checkbox from "../../components/Checkbox";
import IconButton from "../../components/IconButton";
import { useFileRoute, useFileList } from "../../hook/useFile";
import useAction from "../../hook/useAction";
import { modeType } from "./Home";
import { Menu, MenuItem } from "../../components/Menu";
import Dropdown from "rc-dropdown";
import Modal from "../../components/Modal";
import { deleteFile } from "../../api/fileManager";
import Message from "../../components/Message";
import getFileListHandler from "../../lib/getFileList";

type FileBoxProps = {
  name: string;
  type: string;
  updateTime: string;
  size: string;
  iconPath: string;
};

function FileBox({ name, type, updateTime, size, iconPath }: FileBoxProps) {
  const targetIconPath = require(`@/assets/icons/${iconPath}`);
  const fenxiangIconPath = require("@/assets/icons/fenxiang.svg");
  const xiazaiIconPath = require("@/assets/icons/xiazai.svg");
  const bluemoreIconPath = require("@/assets/icons/bluemore.svg");
  const deleteIconPath = require("@/assets/icons/delete.svg");
  const renameIconPath = require("@/assets/icons/rename.svg");
  const copyIconPath = require("@/assets/icons/copy.svg");

  const boxSettingList = [
    {
      index: 1,
      name: "分享",
      icon: fenxiangIconPath,
    },
    {
      index: 2,
      name: "下载",
      icon: xiazaiIconPath,
    },
    {
      index: 3,
      name: "更多",
      icon: bluemoreIconPath,
    },
  ];

  const settingList: modeType[] = [
    {
      index: "1",
      name: "删除",
      value: "delete",
      icon: deleteIconPath,
    },
    {
      index: "2",
      name: "重命名",
      value: "rename",
      icon: renameIconPath,
    },
    {
      index: "3",
      name: "复制",
      value: "copy",
      icon: copyIconPath,
    },
  ];

  const fileRoute = useFileRoute();

  const { setFileRoute, setFileList } = useAction();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [needDeleteId, setNeedDeleteId] = useState<string[]>([]);

  const showDeleteFileModal = function () {
    setIsOpenDelete(true);
  };

  const changeModeType = function (name: string, key: string) {
    if (key === "1") {
      console.log("name ===>", name);
      setNeedDeleteId([name]);
      showDeleteFileModal();
    }
  };

  /** 删除文件 */
  const deleteFileHandler = async function () {
    setIsOpenDelete(false);
    if (needDeleteId.length > 0) {
      try {
        const fileName = needDeleteId[0];
        const route = fileRoute[fileRoute.length - 1].href;
        await deleteFile(route, fileName);
        getFileListHandler(fileRoute, setFileList);
        Message.success("删除成功");
      } catch (error: any) {
        Message.error(error.message);
      }
    }
  };

  /** 点击进入下一层文件夹 */
  function enterFolder() {
    if (type !== "folder") return;
    const targetRoute = `${fileRoute[fileRoute.length - 1].href}${name}/`;
    const targetFileRoute = [...fileRoute, { label: name, href: targetRoute }];
    setFileRoute(targetFileRoute);
  }

  const MenuContent = ({ onClick }: { onClick: (e: any) => void }) => (
    <Menu className="">
      {settingList.map((elem) => {
        return (
          <MenuItem key={elem.index} onClick={onClick}>
            <div className="bg-white md:hover:bg-sky-100 text-black pl-2 pr-6 py-2 flex flex-row justify-start items-center  cursor-pointer">
              <IconButton
                icon={elem.icon}
                width={12}
                height={12}
                iconSize={12}
              />
              <span className={`ml-1`}>{elem.name}</span>
            </div>
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <div className=" group inline-block rounded-lg w-[120px] h-[150px] bg-white hover:bg-sky-200/30 ml-[24px] mb-[32px] md:hover:bg-sky-200/30 cursor-pointer">
      <div
        className="relative  w-full h-full flex flex-col"
        onClick={enterFolder}
      >
        <div className="h-[20px] w-full invisible group-hover:visible">
          <div className=" pt-2  h-[20px] w-full px-1 flex flex-row justify-between">
            <label className="mt-[-5px]">
              <Checkbox />
            </label>
            <div className="flex felx-row justify-center items-center">
              {boxSettingList.map((elem, id) => {
                return elem.index !== 3 ? (
                  <IconButton
                    key={id}
                    icon={elem.icon}
                    width={20}
                    height={20}
                    iconSize={20}
                    className="mx-[1px]"
                  />
                ) : (
                  <Dropdown
                    trigger={["hover"]}
                    overlay={
                      <MenuContent
                        onClick={({ key }) => changeModeType(name, key)}
                      />
                    }
                    // animation="slide-up"
                    // alignPoint
                  >
                    <button>
                      <IconButton
                        icon={elem.icon}
                        width={18}
                        height={18}
                        iconSize={18}
                        className="cursor-pointer"
                      />
                    </button>
                  </Dropdown>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div>
            <IconButton
              icon={targetIconPath}
              width={60}
              height={60}
              iconSize={60}
            />
          </div>
          <div className="w-full text-center text-ellipsis overflow-hidden whitespace-nowrap">
            <span className="w-full text-xs font-semibold ">{name}</span>
          </div>
          <div className="mt-[-6px]">
            <span className="text-xs text-gray-500">
              {type === "folder" ? updateTime : size}
            </span>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpenDelete}
        onClose={setIsOpenDelete}
        onOk={deleteFileHandler}
        showHeader={true}
        title={"删除文件"}
      >
        <div className="w-60 flex flex-row justify-center items-center px-4">
          是否删除该文件?
        </div>
      </Modal>
    </div>
  );
}

export default function FilesLayer() {
  const fileList = useFileList();
  const fileRoute = useFileRoute();
  const { setFileList } = useAction();

  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    getFileListHandler(fileRoute, setFileList);
  }, [fileRoute]);

  useEffect(() => {
    // @ts-ignore
    const height = divRef.current.clientHeight - 80;
    if (height) {
      setWinHeight(height);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="flex-1 w-full  rounded-bl-lg rounded-br-lg flex flex-col"
    >
      <div className="h-[80px] w-full pl-5  flex items-center">
        <label className="flex flex-row items-center">
          <Checkbox />
          <span className="ml-2 text-xs">全选</span>
        </label>
      </div>
      <div
        style={{ height: winHeight > 0 ? `${winHeight}px` : "" }}
        className={`w-full  overflow-y-auto `}
      >
        {winHeight &&
          fileList.map((elem: any, id: any) => {
            return (
              <FileBox
                key={elem.name}
                name={elem.name}
                size={elem.size}
                type={elem.type}
                updateTime={elem.updateTime}
                iconPath={elem.iconPath}
              />
            );
          })}
      </div>
    </div>
  );
}
