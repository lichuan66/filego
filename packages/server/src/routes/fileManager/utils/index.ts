import { Request, Response } from "express";
import logger from "@filego/utils/logger";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
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
  jpg: "image.svg",
  mp4: "video.svg",
  undefind: "unknown.svg",
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

    const fileList = files
      .filter((file) => file !== "__thumbnails")
      .map((file, idx) => {
        const filePath = path.join(targetFolderPath, file);
        const stats = fs.statSync(filePath);
        let isFolder = false;
        let type = "";
        let size = bytesToSize(stats.size);
        let updateTime = dayjs(stats.mtime).format("YYYY-MM-DD HH:mm:ss");
        let suolueStatus = 0;
        if (stats.isDirectory()) {
          isFolder = true;
          type = "folder";
        }
        if (!isFolder) {
          type = file.split(".").pop()?.toLowerCase() || "undefind";

          if (/(jpg|png)$/i.test(type)) {
            const suolueTargetFolderPath = path.join(
              targetFolderPath,
              "__thumbnails"
            );

            // 创建缩略图目录
            if (!fs.existsSync(suolueTargetFolderPath)) {
              fs.mkdirSync(suolueTargetFolderPath);
            }

            const suolueFilePath = path.join(
              suolueTargetFolderPath,
              `${file.replace(/\.[^/.]+$/, "")}.jpg`
            );

            if (fs.existsSync(suolueFilePath)) {
              suolueStatus = 1;
            } else {
              // 使用 sharp 生成缩略图
              sharp(filePath)
                .resize(200, 200) // 设置缩略图尺寸
                .toFile(suolueFilePath, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });
            }
          }
        }
        let iconPath = iconType[type] || "unknown.svg";

        return {
          index: idx + 1,
          name: file,
          type,
          updateTime,
          size,
          iconPath,
          suolueStatus,
        };
      });

    const orderFolderList = fileList.filter((elem) => elem.type === "folder");
    const orderFileList = fileList.filter((elem) => elem.type !== "folder");
    const result = [...orderFolderList, ...orderFileList];

    res.status(200).json({ fileList: result });
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

    if (/\.(jpg|png)$/i.test(fileName)) {
      const suolueTargetFolderPath = path.join(
        targetFolderPath,
        "__thumbnails"
      );
      const suolueTargetFilePath = path.join(
        suolueTargetFolderPath,
        `${fileName.replace(/\.[^/.]+$/, "")}.jpg`
      );

      // 创建缩略图目录
      if (!fs.existsSync(suolueTargetFolderPath)) {
        fs.mkdirSync(suolueTargetFolderPath);
      }

      // 使用 sharp 生成缩略图
      sharp(targetFilePath)
        .resize(200, 200) // 设置缩略图尺寸
        .toFile(suolueTargetFilePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
    }

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

export async function readImg(req: Request, res: Response) {
  try {
    const { route, fileName, username, hasSuolue } = req.query;
    console.log(req.query);

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
    let filePath = path.join(
      targetFolderPath,
      JSON.parse(JSON.stringify(fileName))
    );
    if (hasSuolue) {
      const suolueTargetFolderPath = path.join(
        targetFolderPath,
        "__thumbnails"
      );

      // 创建缩略图目录
      if (!fs.existsSync(suolueTargetFolderPath)) {
        fs.mkdirSync(suolueTargetFolderPath);
      }

      filePath = path.join(
        suolueTargetFolderPath,
        `${JSON.parse(JSON.stringify(fileName)).replace(/\.[^/.]+$/, "")}.jpg`
      );

      console.log(filePath, 222);
    }

    console.log("filePath ===>", filePath);

    // 读取图片文件的最后修改时间
    const fileStat = fs.statSync(filePath);
    const lastModified = fileStat.mtime.toUTCString();
    const ifModifiedSince = req.headers["if-modified-since"];

    // 设置 ETag
    const etag = fileStat.size.toString() + "-" + lastModified;

    // 检查 If-Modified-Since 头
    if (ifModifiedSince === lastModified) {
      res.status(304).send(); // Not Modified
      return;
    }

    // 设置响应头
    res.setHeader("Cache-Control", `public, max-age=${config.CACHE_MAX_AGE}`);
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("ETag", etag);

    res.status(200).sendFile(filePath);
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}

export async function readText(req: Request, res: Response) {
  try {
    const { route, fileName } = req.query;
    const username = req.headers._username as string;

    const rootPath = path.join(__dirname, "../../../store", username);
    const targetFolderPath = path.join(
      rootPath,
      JSON.parse(JSON.stringify(route))
    );
    const filePath = path.join(
      targetFolderPath,
      JSON.parse(JSON.stringify(fileName))
    );

    const buffer = fs.readFileSync(filePath, "utf8");
    const result = JSON.parse(JSON.stringify(buffer));
    const contentList = result.split("\r\n");
    console.log(contentList);

    res.status(200).json(contentList);
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}

export async function readPdf(req: Request, res: Response) {
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

    // 创建一个读取PDF文件的流
    const pdfReadStream = fs.createReadStream(filePath);

    // 设置响应头
    res.set({
      "Content-Type": "application/pdf",
    });

    // 管道数据到响应对象
    pdfReadStream.pipe(res);
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}

export async function readVideo(req: Request, res: Response) {
  try {
    const { route, fileName, username } = req.query;
    console.log(req.query);

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
    console.log(filePath);

    // const videoStream = fs.createReadStream(filePath);

    res.contentType("video/mp4");

    ffmpeg(filePath)
      // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
      // .preset("flashvideo")
      .outputOption([
        "-c:v libx264",
        "-movflags frag_keyframe+empty_moov",
        "-f mp4",
      ])
      // setup event handlers
      .on("end", function () {
        console.log("file has been converted succesfully");
      })
      .on("error", function (err) {
        console.log("an error happened: " + err.message);
      })
      // save to stream
      .pipe(res, { end: true });
  } catch (error: any) {
    logger.error("[server]", error.message);
    console.log(error);
    res.status(500).json(error.message);
  }
}
