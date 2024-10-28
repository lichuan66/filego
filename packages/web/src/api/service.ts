import fetch from "../lib/fetchSocket";
import { GroupMember } from "../types/user";
import { uploadPostApi } from "../lib/fetch";
import config from "@filego/config/client";

const userApi = `http://${config.Server}/api/fileManager`;

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

/**
 * 创建群组
 * @param name 群组名
 * @returns
 */
export async function createGroup(name: string) {
  const [_, group] = await fetch("createGroup", { name });
  return group;
}

export async function addFriend(userId: string) {
  const [, user] = await fetch("addFriend", { userId });
  return user;
}

/**
 * 使用token登陆
 * @param token
 * @returns
 */
export async function loginByToken(token: string) {
  const [err, user] = await fetch("loginByToken", { token });
  if (err) {
    return null;
  }
  return user;
}

/**
 *  Get the last messages and unread number of a group of linkmans
 * @param linkmanIds
 * @returns
 */
export async function getLinkmansLastMessagesV2(linkmanIds: string[]) {
  const [, linkmanMessages] = await fetch("getLinkmansLastMessagesV2", {
    linkmans: linkmanIds,
  });
  return linkmanMessages;
}

export async function getUserOnlineStatus(userId: string) {
  const [, res] = await fetch("getUserOnlineStatus", { userId });
  console.log(res, 123456);

  return res && res.isOnline;
}

export async function deleteFriend(userId: string) {
  const [err] = await fetch("deleteFriend", { userId });
  return !err;
}

/**
 * 上传文件
 * @param blob 文件blob数据
 * @param fileName 文件名
 * @returns
 */
export async function uploadFile(blob: any, fileName: string): Promise<string> {
  const [uploadErr, result] = await fetch("uploadFile", {
    file: blob,
    fileName,
  });

  console.log(uploadErr, result);

  if (uploadErr) {
    throw Error(uploadErr);
  }
  return result.url;
}

/** 上传Message文件 */
export async function uploadMessageFile(formData: any) {
  const url = `${userApi}/uploadMessageFile`;
  // return fetchPostApi(url, { file: blob, fileName });
  return uploadPostApi(url, formData);
}
