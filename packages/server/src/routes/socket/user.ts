// import logger from "@filego/utils/logger";
import User from "@filego/database/mongoose/models/user";
import assert, { AssertionError } from "assert";
import jwt from "jsonwebtoken";
import config from "@filego/config/server";
import bcrypt from "bcryptjs";
import getRandomAvatar from "@filego/utils/getRandomAvatar";
import path from "path";
import { createFolder } from "../../utils/fileHandler";
import Group, { GroupDocument } from "@filego/database/mongoose/models/group";
import Socket from "@filego/database/mongoose/models/socket";
import isValidObjectId from "@filego/database/mongoose/isValidObjectId";
import Friend from "@filego/database/mongoose/models/friend";

enum ERROR_TYPE {
  USERNAME_NOTFOUND = "用户名不能为空",
  PASSWORD_NOTFOUND = "密码不能为空",
}

/** 生成token */
function generateToken(userId: string) {
  return jwt.sign(
    {
      userId,
    },
    config.jwtSecret,
    { expiresIn: "1 days" }
  );
}

/**
 * 用户注册
 * @param ctx
 * @returns
 */
export async function register(
  ctx: Context<{ username: string; password: string }>
) {
  const { username, password } = ctx.data;

  assert(username, ERROR_TYPE.USERNAME_NOTFOUND);
  assert(password, ERROR_TYPE.PASSWORD_NOTFOUND);

  const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  const defaultGroup = await Group.findOne({ isDefault: true });
  if (!defaultGroup) {
    throw new AssertionError({ message: "默认群组不存在" });
  }

  const newUser = await User.create({
    username,
    hash,
    salt,
    avatar: getRandomAvatar(),
    phonenumber: "",
    password: hash,
  });

  // 创建用户存储文件夹
  const folderPath = path.join(
    __dirname,
    "../../store",
    (newUser._id as string).toString()
  );
  createFolder(folderPath);

  if (!defaultGroup.creator) {
    defaultGroup.creator = newUser._id as string;
  }
  defaultGroup.members.push(newUser._id as string);
  await defaultGroup.save();

  const token = generateToken((newUser._id as string).toString());

  ctx.socket.user = (newUser._id as string).toString();
  await Socket.updateOne(
    { id: ctx.socket.id },
    {
      user: newUser._id,
    }
  );

  return {
    _id: newUser._id,
    avatar: newUser.avatar,
    username: newUser.username,
    token,
    groups: [
      {
        _id: defaultGroup._id,
        name: defaultGroup.name,
        avatar: defaultGroup.avatar,
        creator: defaultGroup.creator,
        createTime: defaultGroup.createTime,
        messages: [],
      },
    ],
    friends: [],
    isAdmin: false,
    notificationTokens: [],
  };
}

/**
 * 用户登陆
 * @param ctx
 * @returns
 */
export async function userLogin(
  ctx: Context<{ username: string; password: string }>
) {
  const { username, password } = ctx.data;

  assert(username, ERROR_TYPE.USERNAME_NOTFOUND);
  assert(password, ERROR_TYPE.PASSWORD_NOTFOUND);

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("当前账户不存在");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  assert(isPasswordCorrect, "密码错误");

  // 创建用户存储文件夹
  const folderPath = path.join(
    __dirname,
    "../../store",
    (user._id as string).toString()
  );
  createFolder(folderPath);

  const token = generateToken((user._id as string).toString());

  user.lastLoginTime = new Date();
  user.lastLoginIp = ctx.socket.ip;
  await user.save();

  const groups = await Group.find(
    {
      members: user._id,
    },
    {
      _id: 1,
      name: 1,
      avatar: 1,
      creator: 1,
      createTime: 1,
    }
  );

  groups.forEach((group) => {
    ctx.socket.join((group._id as string).toString());
  });

  ctx.socket.user = (user._id as string).toString();
  await Socket.updateOne(
    {
      id: ctx.socket.id,
    },
    {
      user: user._id,
    }
  );

  return {
    _id: user._id,
    avatar: user.avatar,
    username: user.username,
    token,
    groups,
    friends: [],
    isAdmin: false,
    notificationTokens: [],
  };
}

export async function loginByToken(ctx: Context<{ token: string }>) {
  const { token } = ctx.data;
  assert(token, "token不能为空");

  let payload: any = null;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return "非法token";
  }

  assert(Date.now() < payload.exp * 1000, "token已过期");

  const user = await User.findOne(
    {
      _id: payload.userId,
    },
    {
      _id: 1,
      avatar: 1,
      username: 1,
      tag: 1,
      createTime: 1,
    }
  );
  if (!user) {
    throw new AssertionError({ message: "用户不存在" });
  }

  user.lastLoginTime = new Date();
  user.lastLoginIp = ctx.socket.ip;
  await user.save();

  const groups = await Group.find(
    {
      members: user._id,
    },
    {
      _id: 1,
      name: 1,
      avatar: 1,
      creator: 1,
      createTime: 1,
    }
  );

  groups.forEach((group: GroupDocument) => {
    ctx.socket.join((group._id as string).toString());
  });

  const friends = await Friend.find({ from: user._id }).populate("to", {
    avatar: 1,
    username: 1,
  });

  ctx.socket.user = (user._id as string).toString();
  await Socket.updateMany(
    {
      id: ctx.socket.id,
    },
    {
      user: user._id,
    }
  );

  console.log("token 登陆成功");

  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar,
    groups,
    friends,
  };
}

/**
 * 添加好友
 * @param ctx
 * @returns
 */
export async function addFriend(ctx: Context<{ userId: string }>) {
  const { userId } = ctx.data;
  assert(isValidObjectId(userId), "无效的用户Id");
  assert(ctx.socket.user !== userId, "不能添加自己为好友");

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AssertionError({ message: "添加好友失败，用户不存在" });
  }

  const friend = await Friend.find({ from: ctx.socket.user, to: user._id });
  assert(friend.length === 0, "你们已经是好朋友了");

  const newFriend = await Friend.create({
    from: ctx.socket.user,
    to: user._id,
  });

  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar,
    from: newFriend.from,
    to: newFriend.to,
  };
}

/**
 * 删除好友，单向删除
 */
export async function deleteFriend(ctx: Context<{ userId: string }>) {
  const { userId } = ctx.data;
  assert(isValidObjectId(userId), "无效的用户id");

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AssertionError({ message: "用户不存在" });
  }

  await Friend.deleteOne({ from: ctx.socket.user, to: user._id });
  return {};
}

const UserOnlineStatusCacheExpireTime = 1000 * 60;
function getUserOnlineStatusWrapper() {
  const cache: Record<string, { value: boolean; expireTime: number }> = {};
  return async function getUserOnlineStatus(ctx: Context<{ userId: string }>) {
    const { userId } = ctx.data;
    assert(userId, "userId不能为空");
    assert(isValidObjectId(userId), "不合法的userId");
    if (cache[userId] && cache[userId].expireTime > Date.now()) {
      return { isOnline: cache[userId].value };
    }

    const sockets = await Socket.find({ user: userId });
    const isOnline = sockets.length > 0;
    cache[userId] = {
      value: isOnline,
      expireTime: Date.now() + UserOnlineStatusCacheExpireTime,
    };
    return { isOnline };
  };
}
export const getUserOnlineStatus = getUserOnlineStatusWrapper();
