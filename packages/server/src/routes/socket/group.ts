import stringHash from "string-hash";
import Socket from "@filego/database/mongoose/models/socket";
import Group, { GroupDocument } from "@filego/database/mongoose/models/group";
import assert, { AssertionError } from "assert";
import getRandomAvatar from "@filego/utils/getRandomAvatar";
import isValidObjectId from "@filego/database/mongoose/isValidObjectId";
import Message from "@filego/database/mongoose/models/message";

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

export async function createGroup(ctx: Context<{ name: string }>) {
  const { name } = ctx.data;

  assert(name, "请输入群组名");

  const group = await Group.findOne({ name });
  if (group) {
    assert(!group, "该群组已存在");
  }

  let newGroup = null;
  try {
    newGroup = await Group.create({
      name,
      avatar: getRandomAvatar(),
      creator: ctx.socket.user,
      members: [ctx.socket.user],
    });
  } catch (error) {
    throw error;
  }

  ctx.socket.join((newGroup._id as string).toString());
  return {
    _id: newGroup._id,
    avatar: newGroup.avatar,
    name: newGroup.name,
    creator: newGroup.creator,
    createTime: newGroup.createTime,
  };
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

/**
 * 加入群组
 */
export async function joinGroup(ctx: Context<{ groupId: string }>) {
  const { groupId } = ctx.data;
  assert(isValidObjectId(groupId), "无效的群组ID");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "加入群组失败，群组不存在" });
  }
  assert(group.members.indexOf(ctx.socket.user) === -1, "你已经在群组中");

  group.members.push(ctx.socket.user);
  await group.save();

  const messages = await Message.find(
    {
      toGroup: groupId,
    },
    {
      type: 1,
      content: 1,
      from: 1,
      createTime: 1,
    },
    {
      sort: { createTime: -1 },
      limit: 3,
    }
  ).populate("from", { username: 1, avatar: 1 });
  messages.reverse();

  ctx.socket.join((group._id as string).toString());

  return {
    _id: group._id,
    name: group.name,
    avatar: group.avatar,
    createTime: group.createTime,
    creator: group.creator,
    messages,
  };
}

export async function changeGroupName(
  ctx: Context<{ groupId: string; name: string }>
) {
  const { groupId, name } = ctx.data;
  assert(isValidObjectId(groupId), "无效的群组ID");
  assert(name, "群组名不能为空");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  assert(group.name !== name, "群组名不能和之前一致");

  const targetGroup = await Group.findOne({ name });
  assert(!targetGroup, "该群组名已存在");

  group.name = name;
  await group.save();

  ctx.socket.emit(groupId, "changeGroupName", { groupId, name });

  return {};
}

/**
 * 删除群组
 */
export async function deleteGroup(ctx: Context<{ groupId: string }>) {
  const { groupId } = ctx.data;
  assert(isValidObjectId(groupId), "无效的群组ID");

  const group = await Group.findOne({ _id: groupId });
  if (!group) {
    throw new AssertionError({ message: "群组不存在" });
  }
  assert(
    group.creator.toString() === ctx.socket.user.toString(),
    "只有群组才能解散群组"
  );
  assert(group.isDefault !== true, "默认群组不允许删除");

  await Group.deleteOne({ _id: groupId });

  ctx.socket.emit(groupId, "deleteGroup", { groupId });
  return {};
}
