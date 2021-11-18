/* eslint-disable consistent-return */
import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination(_: Request, __: Express.Multer.File, cb) {
    cb(null, 'uploads/');
  },
  filename(_: Request, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Images only!'));
}
const upload = multer({
  storage,
  fileFilter(_: Request, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req?.file?.path}`);
});

export default router;
