import { Request, Response } from "express";
import logger from "@filego/utils/logger";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import {
  bytesToSize,
  createFolder,
  writeStreamToFile,
  deleteFolder,
} from "../../../utils/fileHandler";
import config from "@filego/config/server";

const iconType: { [key: string]: string } = {
  folder: "wenjianjia.svg",
  pdf: "pdf.svg",
  txt: "txt.svg",
  zip: "zip.svg",
  png: "image.svg",
};

export async function getFileList(req: Request, res: Response) {
  try {
    const username = req.headers._username as string;
    const { route } = req.query;

    const rootPath = path.join(__dirname, "../../../store", username);
    const targetFolderPath = path.join(
      rootPath,
      JSON.parse(JSON.stringify(route))
    );

    const files = fs.readdirSync(targetFolderPath);

    const fileList = files.map((file, idx) => {
      const filePath = path.join(targetFolderPath, file);
      const stats = fs.statSync(filePath);
      let isFolder = false;
      let type = "";
      let size = bytesToSize(stats.size);
      let updateTime = dayjs(stats.mtime).format("YYYY-MM-DD HH:mm:ss");
      if (stats.isDirectory()) {
        isFolder = true;
        type = "folder";
      }
      if (!isFolder) {
        type = file.split(".").pop() || "undefind";
      }
      let iconPath = iconType[type];

      return {
        index: idx + 1,
        name: file,
        type,
        updateTime,
        size,
        iconPath,
      };
    });

    res.status(200).json({ fileList });
  } catch (error: any) {
    logger.error("[server]", error.message);
    res.status(500).json(error.message);
  }
}

export async function newFolder(req: Request, res: Response) {
  try {
    const { route, folderName } = req.body;
    const username = req.headers._username as string;

    const rootPath = path.join(__dirname, "../../../store", username);
    const targetFolderPath = path.join(rootPath, route);
    const newFolderPath = path.join(targetFolderPath, folderName);
    createFolder(newFolderPath);

    res.status(200).json({});
  } catch (error: any) {
    logger.error("[server]", error.message);
    res.status(500).json(error.message);
  }
}

export async function uploadFile(req: Request, res: Response) {
  try {
    const file = req.file;
    const username = req.headers._username as string;
    const { route, fileName } = req.body;

    if (!file) {
      res.status(400).json("No file uploaded.");
      return;
    }

    const rootPath = path.join(__dirname, "../../../store", username);
    const targetFolderPath = path.join(rootPath, route);
    const targetFilePath = path.join(targetFolderPath, fileName);

    await writeStreamToFile(targetFilePath, file);

    res.status(200).json({});
  } catch (error: any) {
    logger.error("[server]", error.message);
    res.status(500).json(error.message);
  }
}

export async function deleteFile(req: Request, res: Response) {
  try {
    const { route, fileName } = req.body;
    const username = req.headers._username as string;

    const rootPath = path.join(__dirname, "../../../store", username);
    const targetFolderPath = path.join(rootPath, route);
    const filePath = path.join(targetFolderPath, fileName);

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      deleteFolder(filePath);
    } else {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({});
  } catch (error: any) {
    logger.error("[server]", error.message);
    res.status(500).json(error.message);
  }
}

export async function preDownloadFile(req: Request, res: Response) {
  try {
    // 设置 Cookie
    res.cookie("exampleCookie", "exampleValue", {
      maxAge: 900000, // Cookie 过期时间（毫秒）
      httpOnly: true, // 标记为 HttpOnly，防止 JavaScript 访问
      secure: false, // 如果是 https 协议，则设置为 true
      sameSite: "strict", // 防止 CSRF 攻击
    });

    res.status(200).json({});
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}

export async function downloadFile(req: Request, res: Response) {
  try {
    const { route, fileName, username } = req.query;

    const tokenWithoutBearer = JSON.parse(JSON.stringify(username)).replace(
      "Bearer ",
      ""
    );
    let { userId } = require("jsonwebtoken").verify(
      tokenWithoutBearer,
      config.jwtSecret
    );

    const rootPath = path.join(__dirname, "../../../store", userId);
    const targetFolderPath = path.join(
      rootPath,
      JSON.parse(JSON.stringify(route))
    );
    const filePath = path.join(
      targetFolderPath,
      JSON.parse(JSON.stringify(fileName))
    );

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.status(200).sendFile(filePath);
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}
