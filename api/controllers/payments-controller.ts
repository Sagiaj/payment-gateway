import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../error-codes";
import CardNetworkFactory from "../models/card-networks/card-network-factory";
import { CardNetworkType } from "../models/card-networks/card-network-types";
import PaymentService from "../services/business/payment-service";

export default class PaymentsController {
  static async createCardPayment(req: Request, res: Response, next: NextFunction) {
    const method_name = `PaymentsController/createCardPayment`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const result = await PaymentService.createCardPayment(correlation_id);
      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send(result);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to create card payment. Error:`, err);
      return next(ErrorCodes.ERROR_CREATE_CARD_PAYMENT);
    }
  }
  
  static async authorizeCardTransaction(req: Request, res: Response, next: NextFunction) {
    const method_name = `PaymentsController/authorizeCardTransaction`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const card_network_type = <CardNetworkType>req.params["card_network_type"];
      const cardNetworkProvider = CardNetworkFactory.create(card_network_type);
      const authorizationRequest = cardNetworkProvider.authorization_request.parseFromRequest(correlation_id, req.body);
      const result = await PaymentService.authorizeCardTransaction(correlation_id, authorizationRequest);
      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send(result.data);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to create card payment. Error:`, err);
      return next(ErrorCodes.ERROR_CREATE_CARD_PAYMENT);
    }
  }
}
