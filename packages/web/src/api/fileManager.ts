import {
  fetchPostApi,
  fetchGetApi,
  uploadPostApi,
  fetchDeleteApi,
} from "../lib/fetch";
import config from "@filego/config/client";

const userApi = `http://${config.Server}/api/fileManager`;

/** 获取用户文件列表 */
export async function getFileList(route: string) {
  const url = `${userApi}/getFileList`;
  return fetchGetApi(url, { route });
}

/** 新建文件夹 */
export async function newFolder(route: string, folderName: string) {
  const url = `${userApi}/newFolder`;
  return fetchPostApi(url, { route, folderName });
}

/** 上传文件夹 */
export async function uploadFile(formData: any) {
  const url = `${userApi}/uploadFile`;
  return uploadPostApi(url, formData);
}

/** 删除文件 */
export async function deleteFile(route: string, fileName: string) {
  const url = `${userApi}/deleteFile`;
  return fetchDeleteApi(url, { route, fileName });
}
