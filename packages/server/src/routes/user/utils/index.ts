import { Request, Response } from "express";
import logger from "@filego/utils/logger";
import User from "@filego/database/mongoose/models/user";
import assert, { AssertionError } from "assert";
import jwt from "jsonwebtoken";
import config from "@filego/config/server";
import bcrypt from "bcryptjs";
import getRandomAvatar from "@filego/utils/getRandomAvatar";
import path from "path";
import { createFolder } from "../../../utils/fileHandler";
import Group from "@filego/database/mongoose/models/group";

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

/** 注册 */
export async function userCreate(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

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
      "../../../store",
      (newUser._id as string).toString()
    );
    createFolder(folderPath);

    if (!defaultGroup.creator) {
      defaultGroup.creator = newUser._id as string;
    }
    defaultGroup.members.push(newUser._id as string);
    await defaultGroup.save();

    const token = generateToken((newUser._id as string).toString());

    res.status(200).json({
      _id: newUser._id,
      avatar: newUser.avatar,
      username: newUser.username,
      token,
    });
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}

/** 登陆 */
export async function userLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

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
      "../../../store",
      (user._id as string).toString()
    );
    createFolder(folderPath);

    const token = generateToken((user._id as string).toString());

    res.status(200).json({
      _id: user._id,
      avatar: user.avatar,
      username: user.username,
      token,
    });
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}
