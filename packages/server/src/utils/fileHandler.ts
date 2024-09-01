import fs from "fs";
import path from "path";

const stream = require("stream");

export function createFolder(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

export function deleteFolder(folderPath: string) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      deleteFolder(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });

  fs.rmdirSync(folderPath);
}

export function bytesToSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

// 同步写入流的函数
export async function writeStreamToFile(filePath: string, fileData: any) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);

    // 将Buffer转换为可读流
    // const readStream = fs.createReadStream().end(fileData.buffer);

    const bufferStream = new stream.PassThrough();
    const readStream = bufferStream.end(fileData.buffer);

    // 管道操作
    readStream
      .pipe(writeStream)
      .on("finish", () => {
        resolve("");
      })
      .on("error", (err: any) => {
        reject(err.message);
      });

    console.log("写入完成");
  });
}
