import React, { useState, useEffect, useRef, createRef } from "react";
import ReactDOM from "react-dom";
import Checkbox from "../../components/Checkbox";
import IconButton from "../../components/IconButton";
import { useFileRoute, useFileList } from "../../hook/useFile";
import useAction from "../../hook/useAction";
import { modeType } from "./Home";
import { Menu, MenuItem } from "../../components/Menu";
import Dropdown from "rc-dropdown";
import Modal from "../../components/Modal";
import { deleteFile, preDownloadFile } from "../../api/fileManager";
import { checkResourceExists } from "../../lib/fetch";
import Message from "../../components/Message";
import getFileListHandler from "../../lib/getFileList";
import config from "@filego/config/client";
import { useFileRoute } from "../hook/useFile";
import { getToken } from "@/api/auth";
import Window from "../../components/Window";
import ImageBox from "../../components/ImageBox";
import TextBox from "../../components/TextBox";
import PdfBox from "../../components/PdfBox";
import VideoBox from "../../components/VideoBox";

type FileBoxProps = {
  name: string;
  type: string;
  updateTime: string;
  size: string;
  iconPath: string;
  suolueStatus: number;
};

export default function FileBox({
  name,
  type,
  updateTime,
  size,
  iconPath,
  suolueStatus,
}: FileBoxProps) {
  let targetIconPath = require(`@/assets/icons/${iconPath}`);
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
  const [isOpenWindow, setIsOpenWindow] = useState(false);

  if (suolueStatus) {
    const route = fileRoute[fileRoute.length - 1].href;
    const userApi = `http://${config.Server}/api/fileManager`;
    targetIconPath = `${userApi}/readImg?route=${route}&fileName=${name}&hasSuolue=${1}&username=${getToken()}`;
  }

  const changeModeType = function (name: string, key: string) {
    if (key === "1") {
      setNeedDeleteId([name]);
      setIsOpenDelete(true);
    } else if (key === "下载") {
      downloadFileHandler(name);
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
        console.log(error);
        Message.error(error.message);
      }
    }
  };

  /** 下载文件 */
  const downloadFileHandler = async function (fileName: string) {
    try {
      // await preDownloadFile();

      const route = fileRoute[fileRoute.length - 1].href;
      const userApi = `http://${config.Server}/api/fileManager`;
      // 设置 href 属性为下载文件的 URL
      const downloadLink = document.createElement("a");
      downloadLink.href = `${userApi}/downloadFile?route=${route}&fileName=${fileName}&username=${getToken()}`;
      // 触发点击事件
      downloadLink.click();
    } catch (error: any) {
      console.log(error);
      Message.error(error.message);
    }
  };

  /** 点击进入下一层文件夹 */
  function enterFolder() {
    if (type !== "folder") {
      !isOpenWindow && setIsOpenWindow(true);
      return;
    }
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
                    onClick={() => changeModeType(name, elem.name)}
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
      {isOpenWindow &&
        ReactDOM.createPortal(
          <Window
            full={/\.pdf$/i.test(name)}
            title={name}
            isOpen={isOpenWindow}
            onClose={setIsOpenWindow}
          >
            {/\.(jpg|png)$/i.test(name) && <ImageBox name={name} />}
            {/\.txt$/i.test(name) && <TextBox name={name} />}
            {/\.pdf$/i.test(name) && <PdfBox name={name} />}
            {/\.mp4$/i.test(name) && <VideoBox name={name} />}
          </Window>,
          document.body
        )}
    </div>
  );
}
