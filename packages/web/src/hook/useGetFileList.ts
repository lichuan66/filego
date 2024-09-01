import { useEffect, useState } from "react";
import { getFileList } from "../api/fileManager";
import { useFileRoute } from "../hook/useFile";
import useAction from "./useAction";

export default function useGetFileList() {
  const fileRoute = useFileRoute();
  const { setFileList } = useAction();
  // const [fileList, setFileList] = useState<FileListType[]>([]);

  // 获取后端文件夹列表
  async function getFileListHandler() {
    const curFileRoute = fileRoute[fileRoute.length - 1];
    const route = curFileRoute.href;

    const res = await getFileList(route);

    setFileList(res.fileList);
  }

  useEffect(() => {
    getFileListHandler();
  }, [fileRoute]);

  return { getFileListHandler };
}
