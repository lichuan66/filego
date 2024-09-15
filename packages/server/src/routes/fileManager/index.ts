import express from "express";
import multer from "multer";
import {
  getFileList,
  newFolder,
  uploadFile,
  deleteFile,
  downloadFile,
  preDownloadFile,
  readImg,
  readText,
  readPdf,
  readVideo,
} from "./utils/index";

const router = express.Router();

const upload = multer();

router.get("/getFileList", getFileList);
router.post("/newFolder", newFolder);
router.delete("/deleteFile", deleteFile);
router.post("/uploadFile", upload.single("file"), uploadFile);
router.get("/preDownloadFile", preDownloadFile);
router.get("/downloadFile", downloadFile);
router.get("/readImg", readImg);
router.get("/readText", readText);
router.get("/readPdf", readPdf);
router.get("/readVideo", readVideo);

export default router;
