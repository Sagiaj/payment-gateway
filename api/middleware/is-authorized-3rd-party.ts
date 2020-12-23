import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from '../error-codes';
import Merchant from "../models/merchant";
import CryptoService from "../services/crypto-service";
import MerchantService from "../services/merchant-service";

export const isAuthorized3rdParty = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const method_name = `Middleware/isAuthorized3rdParty`;
  const correlation_id = req["correlation_id"];

  try {
    AppLogger.info(correlation_id, `${method_name} - start`);
    let merchant: Merchant = null;
    // merchant.access_key = "ABCDEFG";
    // merchant.secret_key = "SAGI_SECRET"
    merchant = await MerchantService.getMerchantSecretByAccessKey(correlation_id, <string>req.headers["access_key"]);
    let merchant_signature = <string>req.headers["signature"];
    if (!merchant_signature) {
      AppLogger.error(correlation_id, `${method_name} - no signature found.`);
      return next(ErrorCodes.MISSING_AUTHENTICATION_HEADERS);
    }
    
    let bodyString = "";
    if (req.body) {
      bodyString = JSON.stringify(req.body);
      bodyString = bodyString == "{}" ? "" : bodyString;
    }
    
    AppLogger.verbose(correlation_id, `before signing::::`, `salt=${req.headers["salt"]}, timestamp=${req.headers["timestamp"]}, access_key=${req.headers["access_key"]}, merchant.secret_key=${merchant.secret_key}, bodyString=${bodyString}`)
    let toSign = `${req.headers["salt"]}${req.headers["timestamp"]}${req.headers["access_key"]}${merchant.secret_key}${bodyString}`;
    let toSignExtended = req.method.toLowerCase() + req.url + toSign;
    AppLogger.verbose(correlation_id, `toSignExtended=${toSignExtended}`);

    const signatureVerified = await CryptoService.verifySignature(correlation_id, toSignExtended, merchant_signature, merchant.secret_key);

    if (!signatureVerified) {
      AppLogger.error(correlation_id, `${method_name} - failed to authorize 3rd party. error code:`, ErrorCodes.ERROR_UNAUTHORIZED_3RD_PARTY);
      return next(ErrorCodes.ERROR_UNAUTHORIZED_3RD_PARTY);
    }

    AppLogger.info(correlation_id, `${method_name} - end`);
    return next();
  } catch (err) {
    AppLogger.error(correlation_id, `${method_name} - error:`, err);
    return res.status(401).send({ error: ErrorCodes.ERROR_INVALID_SIGNATURE, message: err });
  }
};
