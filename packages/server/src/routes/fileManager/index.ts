import express from "express";
import multer from "multer";
import { getFileList, newFolder, uploadFile, deleteFile } from "./utils/index";

const router = express.Router();

const upload = multer();

router.get("/getFileList", getFileList);
router.post("/newFolder", newFolder);
router.delete("/deleteFile", deleteFile);
router.post("/uploadFile", upload.single("file"), uploadFile);

export default router;
