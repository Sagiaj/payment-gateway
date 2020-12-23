import { ErrorCodes } from "../error-codes";

export default class PaymentService {
  static async createCardPayment(correlation_id: string, ): Promise<any> {
    const method_name = `PaymentService/createCardPayment`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to create card payment. Error:`, err);
      return Promise.reject(ErrorCodes.ERROR_CREATE_CARD_PAYMENT);
    }
  }
}
