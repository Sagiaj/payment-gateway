import { NextFunction, Request, Response } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  try {
    AppLogger.info(req["correlation_id"], `Request path: ${req.path}, Request headers: ${JSON.stringify(req.headers, null, 4)}`);
    next();
  } catch (err) {
    return next(err);
  }
};
