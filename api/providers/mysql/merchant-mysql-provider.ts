import { ErrorCodes } from "../../error-codes";
import BaseMySQLProvider from "../base-mysql-provider";

export default class MerchantMySQLProvider {
  static async getMerchantSecretByAccessKey(correlation_id: string, access_key: string) {
    const method_name = "MerchantMySQLProvider/getMerchantSecretByAccessKey";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const params = [access_key];
      const sql = `
      SET @ACCESS_KEY=?;

      SELECT * FROM gateway_merchants
      WHERE gateway_merchant_access_key=@ACCESS_KEY
      LIMIT 1;
      `;

      const results = await BaseMySQLProvider.executeQueryOkPacket(correlation_id, sql, params);
      return results;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(ErrorCodes.ERROR_GET_MERCHANT_SECRET_KEY_BY_ACCESS_KEY);
    }
  }
}