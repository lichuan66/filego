import express from "express";
import { userCreate, userLogin } from "./utils/index";

const router = express.Router();

router.post("/create", userCreate);
router.post("/login", userLogin);

export default router;
