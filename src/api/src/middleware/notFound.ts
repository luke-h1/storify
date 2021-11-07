import { Response, Request } from 'express';

export function notFound(_: Request, res: Response) {
  res.status(404).json({
    message: "Route not found",
  });
}
