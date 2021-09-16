import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";

export const opId = (req: Request, res: Response, next: NextFunction) => {
  const method_name = `Middleware/opId`;
  req["correlation_id"] = uuid();
  try {
    AppLogger.info(req["correlation_id"], `${method_name} - start`);
    req.headers["correlation_id"] = req["correlation_id"];
    return next();
  } catch (err) {
    AppLogger.error(req["correlation_id"], `${method_name} - error:`, err);
    return next(err);
  }
};
