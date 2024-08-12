import { Request, Response } from "express";
import logger from "@filego/utils/logger";
import User from "@filego/database/mongoose/models/user";
import assert from "assert";

enum ERROR_TYPE {
  USERNAME_NOTFOUND = "用户名不能为空",
  PASSWORD_NOTFOUND = "密码不能为空",
}

export async function userCreate(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    assert(username, ERROR_TYPE.USERNAME_NOTFOUND);
    assert(password, ERROR_TYPE.PASSWORD_NOTFOUND);

    await User.create({ username, password });

    res.status(200).json(null);
  } catch (error: any) {
    logger.trace("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}

export async function userLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    assert(username, ERROR_TYPE.USERNAME_NOTFOUND);
    assert(password, ERROR_TYPE.PASSWORD_NOTFOUND);

    const result = await User.findOne({ username, password });
    if (!result) {
      throw new Error("当前账户不存在");
    }
    res.status(200).json(result);
  } catch (error: any) {
    logger.trace("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}
