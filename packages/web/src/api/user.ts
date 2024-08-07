import { fetchPostApi } from "../lib/fetch";

const userApi = "http://127.0.0.1:2333/api/user";

/** 用户注册 */
export async function register(username: string, password: string) {
  const url = `${userApi}/create`;
  return fetchPostApi(url, { username, password });
}
