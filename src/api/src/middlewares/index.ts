import { NextFunction, Request, Response } from 'express';

// 10 megabytes
const MAX_FILE_SIZE = 10_000_000;

export function notFound(_: Request, res: Response) {
  res.status(404).json({
    message: 'Route not found',
    status: 'error',
  });
}

export function fileSizeLimit(req: Request, res: Response, next: NextFunction) {
  let invalid = false;

  if (req.files && typeof req.files === 'object') {
    Object.entries(req.files).forEach(([, file]) => {
      if (Array.isArray(file)) {
        // eslint-disable-next-line array-callback-return
        file.map(f => {
          if (f.size > MAX_FILE_SIZE) {
            invalid = true;
          }
        });
      } else if (file.size > MAX_FILE_SIZE) {
        invalid = true;
      }
    });
  }
  if (invalid) {
    return res.status(400).json({ error: 'File size must be below 10MB' });
  }
  return next();
}
