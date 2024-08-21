import config from "@filego/config/server";
import logger from "@filego/utils/logger";
import User from "@filego/database/mongoose/models/user";

const ROUTES = ["/api/user/login", "/api/user/create"];

const routeSet = new Set(ROUTES);

export default function () {
  return async (req: any, res: any, next: any) => {
    console.log("req.path ===>", req.path);

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
        let { id } = require("jsonwebtoken").verify(
          tokenWithoutBearer,
          config.jwtSecret
        );
        logger.info("id ===>", id);
        const user = await User.findById(id);
        if (!user) {
          res.status(401).send({ msg: "请先登录" });
        } else {
          next();
        }
      } catch (error) {
        logger.error("validRes", error);
        res.status(401).send({ msg: "请先登录" });
      }
    }
  };
}
