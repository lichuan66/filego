// import logger from "@filego/utils/logger";
import User from "@filego/database/mongoose/models/user";
import assert, { AssertionError } from "assert";
import jwt from "jsonwebtoken";
import config from "@filego/config/server";
import bcrypt from "bcryptjs";
import getRandomAvatar from "@filego/utils/getRandomAvatar";
import path from "path";
import { createFolder } from "../../utils/fileHandler";
import Group from "@filego/database/mongoose/models/group";
import Socket from "@filego/database/mongoose/models/socket";

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
