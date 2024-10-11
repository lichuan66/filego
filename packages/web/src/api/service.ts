import fetch from "../lib/fetchSocket";
import { GroupMember } from "../types/user";

/** 注册新用户 */
export async function register(username: string, password: string) {
  const [err, user] = await fetch("register", { username, password });
  console.log(err, user);

  if (err) {
    return null;
  }
  return user;
}

/** 登录 */
export async function login(username: string, password: string) {
  const [err, user] = await fetch("userLogin", { username, password });
  if (err) {
    return null;
  }
  return user;
}

/** 获取group在线人数列表 */
export const getGroupOnlineMembers = (() => {
  let cache: { groupId: string; key: string; members: GroupMember[] } = {
    groupId: "",
    key: "",
    members: [],
  };
  return async function _getGroupOnlineMembers(groupId: string) {
    const [, result] = await fetch("getGroupOnlineMembersV2", {
      groupId: groupId,
      cache: cache.groupId === groupId ? cache.key : undefined,
    });

    if (!result) return [];
    if (result.cache === cache.key) {
      return cache.members as GroupMember[];
    }
    cache = {
      groupId,
      key: result.cache,
      members: result.members,
    };
    return result.members;
  };
})();

/**
 * 发送消息
 * @param to 目标
 * @param type
 * @param content
 * @returns
 */
export async function sendMessage(to: string, type: string, content: string) {
  return fetch("sendMessage", { to, type, content });
}
