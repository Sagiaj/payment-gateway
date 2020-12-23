import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../error-codes";
import GatewayError from "../models/gateway-error";
type AppRequest = Request & { correlation_id: string };

export const parseToGatewayError = (error_message: string, data?: any): GatewayError => {
  return GatewayError.parseGatewayError(error_message, 500, data);
}

export const getHTTPStatusCode = (err?: GatewayError) => {
  if (!err) {
    return 200;
  }
  let code: number;
  switch(err.message) {
    case ErrorCodes.ERROR_UNAUTHORIZED_3RD_PARTY:
    case ErrorCodes.ERROR_INVALID_SIGNATURE:
      code = 401;
      break;
    default:
      code = 500;
      break;
  }

  return code;
}

export const appErrorHandler = async (err: any, req: AppRequest, res: Response, next: NextFunction) => {
  const method_name = `appErrorHandler`;
  AppLogger.info(req.correlation_id, `${method_name} - start`);
  try {
    if (!err) {
      return next();
    }
    AppLogger.verbose(req.correlation_id, `${method_name} - returning error:`, err);

    return res.status(getHTTPStatusCode(err)).send(err);
  } catch (err_scope) {
    AppLogger.verbose(req.correlation_id, `${method_name} - error:`, err_scope);
    return res.sendStatus(500).send(parseToGatewayError(err_scope));
  }
}