import path from "path";
import fs from "fs";
import logger from "@filego/utils/logger";

export async function uploadFile(
  ctx: Context<{ fileName: string; file: any }>
) {
  try {
    const [directory, fileName] = ctx.data.fileName.split("/");
    const filePath = path.join(__dirname, "../../../public", directory);
    const isExists = fs.existsSync(filePath);
    if (!isExists) {
      fs.mkdirSync(filePath);
    }
    fs.writeFileSync(path.resolve(filePath, fileName), ctx.data.file);
    return `/${ctx.data.fileName}`;
  } catch (error) {
    const typeErr = error as Error;
    logger.error("[uploadFile]", typeErr.message);
    return `上传文件失败:${typeErr.message}`;
  }
}
