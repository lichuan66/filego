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

const app = express();

type routeListType = [string, Router][];

const routesPath: routeListType = [
  ["/api/user", userRoutes],
  ["/api/fileManager", fileManagerRoutes],
];

(async () => {
  await initMongoDB();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(isAccessValidMid());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  routesPath.forEach((routes) => {
    app.use(routes[0], routes[1]);
  });

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });
})();
