import express from "express";
// import initMongoDB from "@filego/database/mongoose/initMongoDB";
import userRoutes from "./routes/user/user";
import { Router } from "express";
import cors from "cors";
import path from "path";

const app = express();
const port = 2333;

type routeListType = [string, Router][];

const routesPath: routeListType = [["/api/user", userRoutes]];

(async () => {
  // await initMongoDB();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../public")));

  routesPath.forEach((routes) => {
    app.use(routes[0], routes[1]);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
