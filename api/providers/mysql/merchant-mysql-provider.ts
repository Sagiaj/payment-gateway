import { ErrorCodes } from "../../error-codes";
import BaseMySQLProvider from "../base-mysql-provider";

export default class MerchantMySQLProvider {
  static async getMerchantSecretByAccessKey(correlation_id: string, access_key: string) {
    const method_name = "MerchantMySQLProvider/getMerchantSecretByAccessKey";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const params = [access_key];
      const sql = `SELECT merchant_id,
        merchant_access_key,
        merchant_secret_key,
        merchant_name
        FROM merchants
        WHERE merchant_access_key=?
        LIMIT 1;`;

      const results = await BaseMySQLProvider.executeQueryOkPacket(correlation_id, sql, params);
      return results;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(ErrorCodes.ERROR_GET_MERCHANT_SECRET_KEY_BY_ACCESS_KEY);
    }
  }
}