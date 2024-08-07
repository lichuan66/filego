import express from "express";
import { userCreate } from "./utils/index";

const router = express.Router();

router.post("/create", userCreate);

export default router;
