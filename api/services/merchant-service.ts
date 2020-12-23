import { ErrorCodes } from "../error-codes";
import Merchant from "../models/merchant";
import MerchantDBProvider from "../providers/merchant-provider";

export default class MerchantService {
  static async getMerchantSecretByAccessKey(correlation_id: string, access_key: string): Promise<Merchant> {
    const method_name = `MerchantService/getMerchantSecretByAccessKey`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const dbMerchantResult = await MerchantDBProvider.getMerchantSecretByAccessKey(correlation_id, access_key);
      return dbMerchantResult;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed getting merchant's secret key by their access key.`);
      return Promise.reject(ErrorCodes.ERROR_GET_MERCHANT_SECRET_KEY_BY_ACCESS_KEY);
    }
  }
}
