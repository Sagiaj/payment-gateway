import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../error-codes";
import { GatewayService } from "../services/business/gateway-service";
// import CardNetworkFactory from "../models/card-networks/card-network-factory";
// import { CardNetworkType } from "../models/card-networks/card-network-types";
// import PaymentService from "../services/business/payment-service";

export default class WebhookController {

  static async processGatewayAction(req: Request, res: Response, next: NextFunction) {
    const method_name = `WebhookController/processGatewayAction`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider_name = req.params["provider_name"];
      const action_name = req.params["action_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - No provider name given.`);
      } else if (!action_name) {
        AppLogger.error(correlation_id, `${method_name} - No action name given.`);
        return next(ErrorCodes.ERROR_WH_GATEWAY_ACTION)
      }

      AppLogger.verbose(correlation_id, `${method_name} - Request:`, JSON.stringify({
        params: req.params,
        body: req.body
      }));

      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayService/processGatewayAction`);
      const action_result = await GatewayService.processGatewayAction(correlation_id, provider_name, action_name, req);
      AppLogger.info(correlation_id, `${method_name} - end. action_result=`, action_result);
      return res.send(action_result);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - Failed to process 3DS version webhook. Error:`, err);
      return next(ErrorCodes.ERROR_WH_PROCESS_3DS_VERSION);
    }
  }

  static async process3DSVersion(req: Request, res: Response, next: NextFunction) {
    const method_name = `WebhookController/process3DSVersion`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider_name = req.params["provider_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - No provider name given.`);
      }

      AppLogger.verbose(correlation_id, `${method_name} - CHECK THIS!!!!`, JSON.stringify({
        params: req.params,
        body: req.body
      }));
      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send({ true: true });
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - Failed to process 3DS version webhook. Error:`, err);
      return next(ErrorCodes.ERROR_WH_PROCESS_3DS_VERSION);
    }
  }

  static async process3DSMethodComplete(req: Request, res: Response, next: NextFunction) {
    const method_name = `WebhookController/process3DSMethodComplete`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider_name = req.params["provider_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - No provider name given.`);
      }
      AppLogger.verbose(correlation_id, `${method_name} - CHECK THIS!!!!`, JSON.stringify({
        params: req.params,
        body: req.body
      }));
      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send({ true: true });
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - Failed to process 3DS method completion. Error:`, err);
      return next(ErrorCodes.ERROR_WH_PROCESS_3DS_COMPLETE);
    }
  }

  static async process3DSACSChallengeComplete(req: Request, res: Response, next: NextFunction) {
    const method_name = `WebhookController/process3DSACSChallengeComplete`;
    const correlation_id: string = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider_name = req.params["provider_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - No provider name given.`);
      }

      AppLogger.verbose(correlation_id, `${method_name} - CHECK THIS!!!!`, JSON.stringify({
        params: req.params,
        body: req.body
      }));
      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send({ true: true });
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - Failed to process ACS challenge completion. Error:`, err);
      return next(ErrorCodes.ERROR_WH_PROCESS_ACS_CHALLENGE);
    }
  }
}
