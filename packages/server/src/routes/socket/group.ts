import stringHash from "string-hash";
import Socket from "@filego/database/mongoose/models/socket";
import Group, { GroupDocument } from "@filego/database/mongoose/models/group";
import { AssertionError } from "assert";

const GroupOnlineMembersCacheExpireTime = 1000 * 60;

/**
 * 获取指定群组的在线用户方法
 * @param group 群组
 */
async function getGroupOnlineMembersHelper(group: GroupDocument) {
  const sockets = await Socket.find(
    {
      user: {
        $in: group.members.map((elem) => elem.toString()),
      },
    },
    {
      user: 1,
    }
  ).populate("user", { username: 1, avatar: 1 });

  const filterSockets = sockets.reduce((result, socket) => {
    if (socket.user) {
      // @ts-ignore
      result.set(socket.user._id.toString(), socket);
    }
    return result;
  }, new Map());
  return Array.from(filterSockets.values());
}

/**
 * 获取群组在线成员
 */

function getGroupOnlineMembersWrapperV2() {
  const cache: Record<
    string,
    { key?: string; value: any; expireTime: number }
  > = {};
  return async function getGroupOnlineMembersV2(
    ctx: Context<{ groupId: string; cache?: string }>
  ) {
    const { groupId, cache: cacheKey } = ctx.data;

    if (
      cache[groupId] &&
      cache[groupId].key === cacheKey &&
      cache[groupId].expireTime > Date.now()
    ) {
      return { cache: cacheKey };
    }

    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      throw new AssertionError({ message: "群组不存在" });
    }
    const result = await getGroupOnlineMembersHelper(group);
    const resultCacheKey = stringHash(
      result.map((item) => item.user._id).join(",")
    ).toString(36);
    if (cache[groupId] && cache[groupId].key === resultCacheKey) {
      cache[groupId].expireTime =
        Date.now() + GroupOnlineMembersCacheExpireTime;
      if (resultCacheKey === cacheKey) {
        return { cache: cacheKey };
      }
    }

    cache[groupId] = {
      key: resultCacheKey,
      value: result,
      expireTime: Date.now() + GroupOnlineMembersCacheExpireTime,
    };
    return {
      cache: resultCacheKey,
      members: result,
    };
  };
}

export const getGroupOnlineMembersV2 = getGroupOnlineMembersWrapperV2();
