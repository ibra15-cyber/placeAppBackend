import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

const uploadRouter = express.Router();

const upload = multer();

uploadRouter.post("/", upload.single("file"), async (req, res) => {
  //check if the uploaded file came through
  //   if (req.file) {
  //     return console.log(req.file);
  //   }

  cloudinary.config({
    cloud_name: "df4mbuvfb",
    api_key: "367286928989398",
    api_secret: "vHRYSPq1vhwwJvo69Aar0XM2U8g",
  });

  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req);
    res.send(result);
  } catch (error) {
    res.send({ error: "Image upload failed" });
  }
});

export default uploadRouter;
