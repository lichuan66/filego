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
