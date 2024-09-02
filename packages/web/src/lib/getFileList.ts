import { getFileList } from "../api/fileManager";
// import { useFileRoute } from "../hook/useFile";
// import useAction from "../hook/useAction";
import type { FileRouterType } from "../store/reducers/fileSlice";

export default async function getFileListHandler(
  fileRoute: FileRouterType[],
  setFileList: any
) {
  const curFileRoute = fileRoute[fileRoute.length - 1];
  const route = curFileRoute.href;

  const res = await getFileList(route);

  setFileList(res.fileList);
}
