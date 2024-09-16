import config from "@filego/config/server";
import logger from "@filego/utils/logger";
import User from "@filego/database/mongoose/models/user";
import path from "path";

const ROUTES = [
  "/api/user/login",
  "/api/user/create",
  "/login",
  "/api/fileManager/downloadFile",
  "/api/fileManager/readImg",
  "/api/fileManager/readPdf",
  "/api/fileManager/readVideo",
];

const routeSet = new Set(ROUTES);

export default function () {
  return async (req: any, res: any, next: any) => {
    console.log("req.path ===>", req.path);

    if (req.url.startsWith("/client")) {
      console.log(path.join(__dirname + "../../../public/index.html"), 1234);
      res.sendFile(path.join(__dirname + "../../../public/index.html"));
      return;
    }

    if (routeSet.has(req.path)) {
      next();
      return;
    }
    if (!req.headers.authorization) {
      res.status(401).send({ msg: "请先登录" });
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");
      try {
        const tokenWithoutBearer = token.replace("Bearer ", "");
        let { userId } = require("jsonwebtoken").verify(
          tokenWithoutBearer,
          config.jwtSecret
        );
        logger.info("id ===>", userId);
        const user = await User.findById(userId);
        if (!user) {
          res.status(401).send({ msg: "请先登录" });
        } else {
          req.headers._username = userId;
          next();
        }
      } catch (error) {
        logger.error("validRes", error);
        res.status(401).send({ msg: "请先登录" });
      }
    }
  };
}
