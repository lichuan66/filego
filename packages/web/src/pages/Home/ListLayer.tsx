import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import List, { ItemProps } from "../../components/List";
import Table from "../../components/Table";
import { usePageType } from "../../hook/usePage";
import IconButton from "../../components/IconButton";
import Checkbox from "../../components/Checkbox";
import { useFileRoute, useFileList } from "../../hook/useFile";
import useAction from "../../hook/useAction";
import getFileListHandler from "../../lib/getFileList";
import Window from "../../components/Window";
import ImageBox from "../../components/ImageBox";
import TextBox from "../../components/TextBox";
import PdfBox from "../../components/PdfBox";
import VideoBox from "../../components/VideoBox";

export default function ListLayer() {
  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);
  const pageType = usePageType();

  // const { fileList } = useGetFileList();
  const fileList = useFileList();

  const fileRoute = useFileRoute();

  const { setFileRoute, setFileList } = useAction();

  const tableColumns = [
    { key: "name", label: "文件名" },
    { key: "updateTime", label: "修改时间" },
    { key: "size", label: "大小" },
  ];

  useEffect(() => {
    getFileListHandler(fileRoute, setFileList);
  }, [fileRoute]);

  const ItemList = (item: ItemProps) => {
    const [isOpenWindow, setIsOpenWindow] = useState(false);

    /** 点击进入下一层文件夹 */
    function enterFolder(value: any) {
      const { type, name } = value;
      if (type !== "folder") {
        !isOpenWindow && setIsOpenWindow(true);
        return;
      }
      const targetRoute = `${fileRoute[fileRoute.length - 1].href}${name}/`;
      const targetFileRoute = [
        ...fileRoute,
        { label: name, href: targetRoute },
      ];
      setFileRoute(targetFileRoute);
    }

    return (
      <li
        className="px-6 py-4 flex felx-row items-center cursor-pointer active:bg-sky-100 "
        key={item.id}
        onClick={enterFolder}
      >
        <div>
          <img
            src={require(`@/assets/icons/${item.iconPath}`)}
            width={30}
            height={30}
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
        {isOpenWindow &&
          ReactDOM.createPortal(
            <Window
              full={/\.pdf$/i.test(item.name)}
              title={item.name}
              isOpen={isOpenWindow}
              onClose={setIsOpenWindow}
            >
              {/\.(jpg|png)$/i.test(item.name) && <ImageBox name={item.name} />}
              {/\.txt$/i.test(item.name) && <TextBox name={item.name} />}
              {/\.pdf$/i.test(item.name) && <PdfBox name={item.name} />}
              {/\.mp4$/i.test(item.name) && <VideoBox name={item.name} />}
            </Window>,
            document.body
          )}
      </li>
    );
  };

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
        {columns.map((column: any) => {
          const [isOpenWindow, setIsOpenWindow] = useState(false);

          /** 点击进入下一层文件夹 */
          function enterFolder(value: any) {
            const { type, name } = value;
            if (type !== "folder") {
              !isOpenWindow && setIsOpenWindow(true);
              return;
            }
            const targetRoute = `${
              fileRoute[fileRoute.length - 1].href
            }${name}/`;
            const targetFileRoute = [
              ...fileRoute,
              { label: name, href: targetRoute },
            ];
            setFileRoute(targetFileRoute);
          }

          return (
            <td
              style={{
                width: colWidth[column.key] ? colWidth[column.key] : "",
              }}
              className={` text-left text-[14px] py-2`}
              key={rowData.key}
              onClick={() => enterFolder(rowData)}
            >
              <div className={`flex flex-row items-center`}>
                {column.key === "name" && (
                  <div>
                    <img
                      src={require(`@/assets/icons/${rowData.iconPath}`)}
                      width={30}
                      height={30}
                    />
                  </div>
                )}
                <div className="ml-2">
                  <span className="text-[12px]">{rowData[column.key]}</span>
                </div>
              </div>
              {isOpenWindow &&
                ReactDOM.createPortal(
                  <Window
                    full={/\.pdf$/i.test(rowData.name)}
                    title={rowData.name}
                    isOpen={isOpenWindow}
                    onClose={setIsOpenWindow}
                  >
                    {/\.(jpg|png)$/i.test(rowData.name) && (
                      <ImageBox name={rowData.name} />
                    )}
                    {/\.txt$/i.test(rowData.name) && (
                      <TextBox name={rowData.name} />
                    )}
                    {/\.pdf$/i.test(rowData.name) && (
                      <PdfBox name={rowData.name} />
                    )}
                    {/\.mp4$/i.test(rowData.name) && (
                      <VideoBox name={rowData.name} />
                    )}
                  </Window>,
                  document.body
                )}
            </td>
          );
        })}
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
            data={fileList}
            columns={tableColumns}
            children={tableItemList}
          />
        )}
        {pageType === "phone" && (
          <List
            items={fileList}
            headerName={"全部文件"}
            headerClassName="py-4 px-4 text-xs font-bold"
            children={ItemList}
          />
        )}
      </div>
    </div>
  );
}
