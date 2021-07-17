import { Request } from "express";
import { ErrorCodes } from "../../../error-codes";
import { BaseGatewayProvider } from "../base-gateway-provider";
import { GatewayProviderFactory } from "../gateway-provider-factory";

export class PaysafeProvider extends BaseGatewayProvider {
  async getClientToken(correlation_id: string): Promise<string> {
    const method_name = `PaysafeProvider/getClientToken`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const { username, password } = Globals.gateways_config.paysafe.single_use_token;
      const base64_auth_header = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
      AppLogger.info(correlation_id, `${method_name} - end`);
      return base64_auth_header;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name}`);
      return Promise.reject(ErrorCodes.ERROR_GET_MERCHANT_CLIENT_TOKEN);
    }
  }
  async getProviderConfiguration(correlation_id: string): Promise<any> {
    const method_name = `PaysafeProvider/getProviderConfiguration`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const config = Globals.gateways_config.paysafe;
      const base_wh_url = `${Globals.webhooks.base_url}/${GatewayProviderFactory.GatewayProviders.Paysafe}`;
      let providerConfiguration = {
        endpoints: config.endpoints,
        challengeNotificationUrl: `${base_wh_url}${Globals.webhooks.endpoints.wh_acs_challenge_complete_endpoint}`,
        merchant_id: config.account_id,
        base_url: config.base_url,
        webhooks: {
          wh_3ds_version_check_endpoint: `${base_wh_url}${Globals.webhooks.endpoints.wh_3ds_method_url_notification_endpoint}`,
          wh_3ds_method_complete_endpoint: `${base_wh_url}${Globals.webhooks.endpoints.wh_3ds_method_complete_endpoint}`,
          wh_acs_challenge_complete_endpoint: `${base_wh_url}${Globals.webhooks.endpoints.wh_acs_challenge_complete_endpoint}`
        }
      };

      AppLogger.info(correlation_id, `${method_name} - end. returning providerConfiguration=`, JSON.stringify(providerConfiguration, null, 4));
      return providerConfiguration;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name}`);
      return Promise.reject(err);
    }
  }

  async performProviderAction(correlation_id: string, action_name: string, req: Request) {
    const method_name = "PaysafeProvider/performProviderAction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.error(correlation_id, `${method_name} - ${ErrorCodes.NOT_IMPLEMENTED}`);
    return Promise.reject(ErrorCodes.NOT_IMPLEMENTED);
  }
}
