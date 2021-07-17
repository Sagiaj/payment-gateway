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
      return res.send(JSON.parse(action_result));
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

      const req_body_Example = {
        "server_trans_id": "ad0fffeb-bfff-44d0-881f-b857fe77c5a2",
        "acs_trans_id": "13c701a3-5a88-4c45-89e9-ef65e50a8bf9",
        "ds_trans_id": "c272b04f-6e7b-43a2-bb78-90f4fb94aa25",
        "authentication_type": "DYNAMIC_CHALLENGE",
        "challenge_mandated": true,
        "status": "DECOUPLED_AUTHENTICATION_CONFIRMED",
        "status_reason": "LOW_CONFIDENCE",
        "challenge_request_url": "https://test.portal.gpwebpay.com/pay-sim-gpi/sim/acs",
        "authentication_source": "BROWSER",
        "message_category": "PAYMENT_AUTHENTICATION",
        "message_version": "2.2.0",
        "encoded_creq": "eyJ0aHJlZURTU2VydmVyVHJhbnNJRCI6ImFmNjVjMzY5LTU5YjktNGY4ZC1iMmY2LTdkN2Q1ZjVjNjlkNSIsImFjc1RyYW5zSUQiOiIxM2M3MDFhMy01YTg4LTRjNDUtODllOS1lZjY1ZTUwYThiZjkiLCJjaGFsbGVuZ2VXaW5kb3dTaXplIjoiNjAweDQwMCIsIm1lc3NhZ2VUeXBlIjoiQ3JlcSIsIm1lc3NhZ2VWZXJzaW9uIjoiMi4xLjAifQ",
        "acs_reference_number": "3DS_LOA_ACS_201_13579",
        "decoupled_response_indicator": "DECOUPLED_AUTHENTICATION_UTILISED",
        "whitelist_status": "PENDING_CARDHOLDER_CONFIRMATION"
     };

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
