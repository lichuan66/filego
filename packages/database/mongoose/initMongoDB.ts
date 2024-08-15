import mongoose from "mongoose";
import logger from "@filego/utils/logger";
import config from "@filego/config/server";

export default function initMongoDB() {
  return new Promise((resolve) => {
    mongoose
      .connect(config.database, {})
      .then(() => {
        logger.trace(`[mongoDB] 连接成功 ${config.database}`);
        resolve(null);
      })
      .catch((error) => {
        logger.error("[mongoDB]", error.message);
        process.exit(0);
      });
  });
}
