import { ErrorCodes } from "../../error-codes";
import JoseService from "../jose-service";
import * as https from "https";
import axios from "axios";
import { AuthorizationRequest } from "../../models/card-networks/abstract-authorization";

export default class PaymentService {

  static async authorizeCardTransaction(correlation_id: string, authorization: AuthorizationRequest): Promise<any> {
    const method_name = "PaymentService/authorizeCardTransaction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.verbose(correlation_id, `${method_name} - authorization request:`, JSON.stringify(authorization, null, 4));
    try {
      const result = await JoseService.encryptPayload(correlation_id, authorization);
      AppLogger.verbose(correlation_id, `${method_name} - result encryption:`, result);
      
      const url = `${Globals.card_networks.visa.base_url}/payments/authorizations`;
      const { user_id, password } = Globals.card_networks.visa.credentials;
      const Authorization = "Basic " + Buffer.from(`${user_id}:${password}`).toString("base64");

      const httpsAgent = new https.Agent({
        path: url,
        cert: Globals.card_networks.visa.credentials.mutual_ssl.public_key,
        key: Globals.card_networks.visa.credentials.mutual_ssl.private_key
      });

      const response = await axios.post(url, result, {
        httpsAgent,
        headers: {
          Accept: "application/json",
          Authorization,
          "Content-Type": "application/json",
          keyId: Globals.card_networks.visa.credentials.encryption_key_id
        }
      });
      const decrypted = await JoseService.decryptCiphertext(correlation_id, response.data);
      AppLogger.verbose(correlation_id, `${method_name} - decrypted=:`, decrypted);
      AppLogger.verbose(correlation_id, `${method_name} - visa response.data:`, response.data);
      return response.data;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to authorized card payment. error:`, err);
      return Promise.reject(ErrorCodes.ERROR_AUTHORIZED_CARD_PAYMENT);
    }
  }

  static async createCardPayment(correlation_id: string): Promise<any> {
    const method_name = `PaymentService/createCardPayment`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      return true;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to create card payment. Error:`, err);
      return Promise.reject(ErrorCodes.ERROR_CREATE_CARD_PAYMENT);
    }
  }
}
