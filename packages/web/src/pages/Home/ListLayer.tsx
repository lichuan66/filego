import React, { useRef, useEffect, useState } from "react";
import List, { ItemProps } from "../../components/List";
import Table from "../../components/Table";
import { usePageType } from "../../hook/usePage";
import IconButton from "../../components/IconButton";
import Checkbox from "../../components/Checkbox";

export default function ListLayer() {
  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);
  const pageType = usePageType();

  const wenjianjiaIconPath = require("@/assets/icons/wenjianjia.svg");
  const tupianIconPath = require("@/assets/icons/tupian.svg");
  const pdfIconPath = require("@/assets/icons/pdf.svg");
  const zipIconPath = require("@/assets/icons/zip.svg");

  const fileList = [
    {
      index: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      index: 2,
      name: "图片",
      type: "image",
      updateTime: "08-10 17:05",
      size: "20m",
      iconPath: tupianIconPath,
    },
    {
      index: 3,
      name: "pdf",
      type: "pdf",
      updateTime: "08-10 17:05",
      size: "33k",
      iconPath: pdfIconPath,
    },
    {
      index: 4,
      name: "压缩包",
      type: "zip",
      updateTime: "08-10 17:05",
      size: "33k",
      iconPath: zipIconPath,
    },
  ];

  const tableColumns = [
    { key: "name", label: "文件名" },
    { key: "updateTime", label: "修改时间" },
    { key: "size", label: "大小" },
  ];

  const items = [
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 2,
      name: "图片",
      type: "image",
      updateTime: "08-10 17:05",
      size: "20m",
      iconPath: tupianIconPath,
    },
    {
      id: 3,
      name: "pdf",
      type: "pdf",
      updateTime: "08-10 17:05",
      size: "33k",
      iconPath: pdfIconPath,
    },
    {
      id: 4,
      name: "压缩包",
      type: "zip",
      updateTime: "08-10 17:05",
      size: "33k",
      iconPath: zipIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
    {
      id: 1,
      name: "123",
      type: "folder",
      updateTime: "08-10 17:05",
      size: "16k",
      iconPath: wenjianjiaIconPath,
    },
  ];

  const ItemList = (item: ItemProps) => (
    <li
      className="px-6 py-4 flex felx-row items-center cursor-pointer active:bg-sky-100 "
      key={item.id}
    >
      <div>
        <IconButton
          icon={item.iconPath || wenjianjiaIconPath}
          width={30}
          height={30}
          iconSize={30}
        />
      </div>
      <div className="flex flex-col ml-5 text-[12px]">
        <div className="text-[14px] font-bold">
          <span>{item.name}</span>
        </div>
        <div>{item.updateTime}</div>
      </div>
      <div className="ml-auto">
        <Checkbox className="rounded-full w-30 h-30" />
      </div>
    </li>
  );

  const tableItemList = (rowData: any, columns: any) => {
    const colWidth: { [key: string]: string } = {
      updateTime: "250px",
      size: "200px",
    };

    return (
      <tr key={rowData.id} className="cursor-pointer hover:bg-sky-100">
        <td
          style={{ width: "80px" }}
          className=" h-[46px]  text-[14px] py-2 text-center"
          key="id"
        >
          <div className="flex flex-row justify-center items-center">
            <Checkbox className="rounded-full w-30 h-30" />
          </div>
        </td>
        {columns.map((column: any) => (
          <td
            style={{ width: colWidth[column.key] ? colWidth[column.key] : "" }}
            className={` text-left text-[14px] py-2`}
            key={rowData.key}
          >
            <div className={`flex flex-row items-center`}>
              {column.key === "name" && (
                <div>
                  <IconButton
                    icon={rowData.iconPath || wenjianjiaIconPath}
                    width={30}
                    height={30}
                    iconSize={30}
                  />
                </div>
              )}
              <div className="ml-2">
                <span className="text-[12px]">{rowData[column.key]}</span>
              </div>
            </div>
          </td>
        ))}
      </tr>
    );
  };

  useEffect(() => {
    // @ts-ignore
    const height = document.body.clientHeight - 120;

    if (height) {
      setWinHeight(height);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="flex-1 w-full  rounded-bl-lg rounded-br-lg flex flex-col"
    >
      <div
        style={{ height: winHeight > 0 ? `${winHeight}px` : "" }}
        className={`w-full  overflow-y-auto `}
      >
        {pageType === "web" && (
          <Table
            className="py-2 px-6"
            data={items}
            columns={tableColumns}
            children={tableItemList}
          />
        )}
        {pageType === "phone" && (
          <List
            items={items}
            headerName={"全部文件"}
            headerClassName="py-4 px-4 text-xs font-bold"
            children={ItemList}
          />
        )}
      </div>
    </div>
  );
}
