import express from "express";
import multer from "multer";
import {
  getFileList,
  newFolder,
  uploadFile,
  deleteFile,
  downloadFile,
  preDownloadFile,
} from "./utils/index";

const router = express.Router();

const upload = multer();

router.get("/getFileList", getFileList);
router.post("/newFolder", newFolder);
router.delete("/deleteFile", deleteFile);
router.post("/uploadFile", upload.single("file"), uploadFile);
router.get("/preDownloadFile", preDownloadFile);
router.get("/downloadFile", downloadFile);

export default router;
