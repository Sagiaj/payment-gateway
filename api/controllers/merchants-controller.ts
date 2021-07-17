import { Request } from "express";
import { ErrorCodes } from "../error-codes";
import { GatewayService } from "../services/business/gateway-service";

export default class MerchantsController {
  static async mtiMessage(req: Request, res, next) {
    const method_name = `MerchantsController/mtiMessage`;
    const correlation_id = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const result = {};
      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send(result);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return next(ErrorCodes.ERROR_MTI_MESSAGE);
    }
  }

  static async getClientToken(req, res, next) {
    const method_name = `merchantsController/getClientToken`;
    const correlation_id = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider_name = req.params["provider_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - no provider_name provided.`);
        return next(ErrorCodes.ERROR_BAD_PROVIDER_NAME);
      }
      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayService/getClientToken`);
      const clientToken = await GatewayService.getClientToken(correlation_id, provider_name);

      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send(clientToken);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return next(ErrorCodes.ERROR_GET_MERCHANT_CLIENT_TOKEN);
    }
  }
  
  static async getProviderConfiguration(req: Request, res, next) {
    const method_name = `merchantscontroller/getProviderConfiguration`;
    const correlation_id = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider_name = req.params["provider_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - no provider_name provided.`);
        return next(ErrorCodes.ERROR_BAD_PROVIDER_NAME);
      }
      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayService/getProviderConfiguration`);
      const providerConfiguration = await GatewayService.getProviderConfiguration(correlation_id, provider_name);

      AppLogger.info(correlation_id, `${method_name} - end`);
      return res.send(providerConfiguration);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return next(ErrorCodes.ERROR_GET_MERCHANT_CLIENT_TOKEN);
    }
  }

  static async performProviderAction(req: Request, res, next) {
    const method_name = `merchantsController/performProviderAction`;
    const correlation_id = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`, req.body, req.headers);
    try {
      const provider_name = req.params["provider_name"];
      const action_name = req.params["action_name"];
      if (!provider_name) {
        AppLogger.error(correlation_id, `${method_name} - no provider_name provided.`);
        return next(ErrorCodes.ERROR_BAD_PROVIDER_NAME);
      } else if (!action_name) {
        AppLogger.error(correlation_id, `${method_name} - no action_name provided.`);
        return next(ErrorCodes.ERROR_BAD_PROVIDER_ACTION_NAME);
      }
      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayService/performProviderAction`);
      const providerActionResult = await GatewayService.performProviderAction(correlation_id, provider_name, action_name, req);

      AppLogger.info(correlation_id, `${method_name} - end. providerActionResult=`, providerActionResult);
      return res.send(providerActionResult);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return next(ErrorCodes.ERROR_PROVIDER_ACTION);
    }
  }
}
