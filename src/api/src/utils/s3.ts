/* eslint-ignore */
import 'dotenv-safe/config';
import { S3 } from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';

export type S3Object = {
  Etag: string;
  Location: string;
  Key: string;
  Bucket: string;
};

export type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

export const Bucket = new S3({
  signatureVersion: 's3v4',
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const S3DefaultParams = {
  ACL: 'public-read',
  Bucket: process.env.AWS_BUCKET_NAME,
  Conditions: [
    ['content-length-range', 0, 3096000], // 3 Mb
    { acl: 'public-read' },
  ],
};

// const fileFilter = (_req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
//   }
// };

// export const upload = multer({
//   fileFilter,
//   storage: multerS3({
//     acl: 'public-read',
//     s3: Bucket,
//     bucket: 'bwm-ng-dev',
//     metadata(_req, _file, cb) {
//       cb(null, { fieldName: 'TESTING_METADATA' });
//     },
//     key(_req, _file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

// module.exports = upload;
