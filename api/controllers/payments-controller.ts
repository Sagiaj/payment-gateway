import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../error-codes";
import PaymentService from "../services/payment-service";

export default class PaymentsController {
  static async createCardPayment(req: Request, res: Response, next: NextFunction) {
    const method_name = `PaymentsController/createCardPayment`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      await PaymentService.createCardPayment(correlation_id);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to create card payment. Error:`, err);
      return next(ErrorCodes.ERROR_CREATE_CARD_PAYMENT);
    }
  }
}
