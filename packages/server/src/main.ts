import express from "express";
import initMongoDB from "@filego/database/mongoose/initMongoDB";
import userRoutes from "./routes/user";
import fileManagerRoutes from "./routes/fileManager";
import { Router } from "express";
import cors from "cors";
import path from "path";
import config from "@filego/config/server";
import isAccessValidMid from "./middleware/isAccessValidMid";
import bodyParser from "body-parser";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import logger from "@filego/utils/logger";
import { getSocketIp } from "@filego/utils/getSocketIp";
import * as userSocketRoutes from "./routes/socket/user";
import * as groupSocketRoutes from "./routes/socket/group";
import * as messageSocketRoutes from "./routes/socket/message";
import * as systemSocketRoutes from "./routes/socket/system";
import registerRoute from "./middleware/registerRoute";
import Group from "@filego/database/mongoose/models/group";
import getRandomAvatar from "@filego/utils/getRandomAvatar";
import Socket from "@filego/database/mongoose/models/socket";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
  pingTimeout: 10000,
  pingInterval: 5000,
});

type routeListType = [string, Router][];

const routesPath: routeListType = [
  ["/api/user", userRoutes],
  ["/api/fileManager", fileManagerRoutes],
];

(async () => {
  await initMongoDB();

  // 判断默认group是否存在
  const defaultGroup = await Group.findOne({ isDefault: true });
  if (!defaultGroup) {
    const defaultGroup = await Group.create({
      name: "filego",
      avatar: getRandomAvatar(),
      isDefault: true,
    });

    if (!defaultGroup) {
      logger.error("[defaultGroup]", "create default group fail");
      return process.exit(1);
    }
  }

  const routes = {
    ...userSocketRoutes,
    ...groupSocketRoutes,
    ...messageSocketRoutes,
    ...systemSocketRoutes,
  };

  io.on("connection", async (socket) => {
    const ip = getSocketIp(socket);
    logger.trace(`connection ${socket.id} ${ip}`);
    await Socket.create({
      id: socket.id,
      ip: ip,
    });

    socket.on("disconnect", async () => {
      logger.trace(`disconnect ${socket.id}`);
      await Socket.deleteOne({
        id: socket.id,
      });
    });

    socket.use(registerRoute(socket, routes));
  });

  const storePath = path.join(__dirname, "./store");
  if (!fs.existsSync(storePath)) {
    fs.mkdirSync(storePath);
  }

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(isAccessValidMid());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  routesPath.forEach((routes) => {
    app.use(routes[0], routes[1]);
  });

  httpServer.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });
})();
