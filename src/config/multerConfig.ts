import express from "express";
import multer from "multer";
import path from "path";

/*
 * The tutorials that were used in the code for the image storage and retrieval
 * are given below:
 * https://colinrlly.medium.com/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed
 * https://www.youtube.com/watch?v=srPXMt1Q0nY&ab_channel=Academind
 * https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
 * Parts of the code were based off of these two resources
 */

/* Filter out the accepted files by file type - only accept .jpeg, .png, and .jpg */
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: (error: Error, output: boolean) => void) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/* Set up multer to store uploaded files */
const storage = multer.diskStorage({
  destination: (_req: express.Request, _file, cb) => {
    cb(null, path.resolve("src/uploads/"));
  },
  filename: (_req: express.Request, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });
export { upload };
