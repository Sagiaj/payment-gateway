import Merchant from "../models/merchant";
import MerchantMySQLProvider from "./mysql/merchant-mysql-provider";

export default class MerchantDBProvider {
  static async getMerchantSecretByAccessKey(correlation_id: string, access_key: string): Promise<Merchant> {
    const method_name = "MerchantProvider/getMerchantSecretByAccessKey";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const dbResult = await MerchantMySQLProvider.getMerchantSecretByAccessKey(correlation_id, access_key);
      const merchant = Merchant.parseFromDB(dbResult);
      return merchant;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name}`)
      return Promise.reject(err);
    }
  }
}