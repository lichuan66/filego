import { fetchPostApi } from "../lib/fetch";
import config from "@filego/config/client";

const userApi = `http://${config.server}/api/user`;

/** 用户注册 */
export async function register(username: string, password: string) {
  const url = `${userApi}/create`;
  return fetchPostApi(url, { username, password });
}
