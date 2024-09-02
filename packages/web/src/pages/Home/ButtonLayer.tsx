import React, { useState } from "react";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";
import { newFolder, uploadFile } from "../../api/fileManager";
import { useFileRoute, useFileList } from "../../hook/useFile";
import Modal from "../../components/Modal";
import Message from "../../components/Message";
import useAction from "../../hook/useAction";
import getFileListHandler from "../../lib/getFileList";

export default function ButtonLayer() {
  const uploadIconPath = require("@/assets/icons/shangchuan.svg");
  const xinjianIconPath = require("@/assets/icons/xinjian.svg");

  const [searchValue, setSearchValue] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { setFileList } = useAction();
  const fileRoute = useFileRoute();
  const fileList = useFileList();

  function showCreateFolderModal() {
    setIsOpen(true);
  }

  /** 创建文件夹 */
  async function createFolder() {
    if (!newFolderName) {
      Message.info("请输入文件名");
    }
    if (fileList.filter((elem) => elem.name === newFolderName).length > 0) {
      Message.info("文件名已存在");
    }
    const route = fileRoute[fileRoute.length - 1].href;
    setIsOpen(false);
    try {
      await newFolder(route, newFolderName);
      getFileListHandler(fileRoute, setFileList);
      Message.success("新建文件夹成功");
    } catch (error: any) {
      Message.error(error.message);
    }
  }

  /** 上传文件 */
  async function uploadFileHandler() {
    const btn = document.getElementById("uploadFile");

    const handleFileChange = async function (e: any) {
      const files = (e.target as HTMLInputElement)?.files;
      if (files) {
        const file = files[0];

        const route = fileRoute[fileRoute.length - 1].href;

        // 创建 FormData 对象
        const formData = new FormData();
        formData.append("file", file);
        formData.append("route", route);
        formData.append("fileName", file.name);

        try {
          await uploadFile(formData);
          getFileListHandler(fileRoute, setFileList);
          Message.success("文件上传成功");
        } catch (error: any) {
          Message.error(error.message);
        }

        btn?.removeEventListener("change", handleFileChange);
      }
    };

    btn?.addEventListener("change", handleFileChange);
    btn?.click();
  }

  return (
    <div className="h-16 w-full   rounded-tl-lg rounded-tr-lg flex flex-row justify-between">
      <div className="h-full w-full flex flex-row items-center px-2">
        <Button
          onClick={uploadFileHandler}
          className="md:hover:bg-sky-400 rounded-2xl bg-sky-400 w-24 font-custom py-[2px]"
        >
          <div className="flex flex-row items-center justify-center">
            <IconButton
              icon={uploadIconPath}
              width={18}
              height={18}
              iconSize={18}
            />
            <span className="text-[14px] ml-1">上传</span>
          </div>
        </Button>
        <Button
          onClick={showCreateFolderModal}
          className="ml-3 md:hover:bg-sky-400/30 rounded-2xl bg-sky-300/10 w-30 font-custom py-[2px] text-blue-600"
        >
          <div className="flex flex-row items-center justify-center">
            <IconButton
              icon={xinjianIconPath}
              width={18}
              height={18}
              iconSize={18}
            />
            <span className="text-[14px] ml-1">新建文件夹</span>
          </div>
        </Button>
        <input type="file" style={{ display: "none" }} id="uploadFile" />
      </div>
      <div className="flex justify-center items-center px-2 ">
        <Input
          className=""
          inputClassName="border-2 border-sky-400 text-[12px] rounded-tr-none rounded-br-none"
          placeholder="搜索我的文件"
          value={searchValue}
          iconSize={10}
          iconClassName="md:hover:bg-white"
          onChange={setSearchValue}
        />
        <Button className="h-[32px] w-[60px] px-1 text-[10px] rounded-tr-lg rounded-br-lg">
          搜索
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={setIsOpen}
        onOk={createFolder}
        showHeader={true}
        title={"新建文件夹"}
      >
        <div className=" flex flex-row justify-center items-center px-4">
          <label className="mr-2 text-sm block text-gray-700">
            {"文件夹名"}
          </label>
          <Input
            className=""
            placeholder="请输入文件夹名"
            value={newFolderName}
            iconSize={10}
            onChange={setNewFolderName}
          />
        </div>
      </Modal>
    </div>
  );
}
