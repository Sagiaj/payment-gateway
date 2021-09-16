import { BlueSnapConfig, BlueSnapGateway } from "bluesnap";
import axios from "axios";
import { ErrorCodes } from "../../../error-codes";
import { BaseGatewayProvider } from "../base-gateway-provider";
import { Request } from "express";

export class BluesnapProvider extends BaseGatewayProvider {
  getProviderConfiguration(correlation_id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  private static gateway: BlueSnapGateway;
  private auth_token: string;

  get provider() {
    if (!BluesnapProvider.gateway) {
      const { username, password } = Globals.gateways_config.bluesnap;
      const bluesnapConfig = new BlueSnapConfig("Sandbox", username, password);
      BluesnapProvider.gateway = new BlueSnapGateway(bluesnapConfig);
    }

    return BluesnapProvider.gateway;
  }

  async getClientToken(correlation_id: string): Promise<string> {
    const method_name = "BluesnapProvider/getClientToken";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const { username, password } = Globals.gateways_config.bluesnap;
      const authorization = Buffer.from(`${username}:${password}`).toString("base64");
      const { data: clientToken } = await axios.get(`${Globals.gateways_config.bluesnap.base_url}/services/2/payment-fields-tokens`, { headers: {
        Authorization: `Basic ${authorization}`
      }});
      AppLogger.info(correlation_id, `${method_name} - end. clientToken=`, clientToken);
      return clientToken;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }

  async performProviderAction(correlation_id: string, action_name: string, req: Request) {
    const method_name = "BluesnapProvider/performProviderAction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.error(correlation_id, `${method_name} - ${ErrorCodes.NOT_IMPLEMENTED}`);
    return Promise.reject(ErrorCodes.NOT_IMPLEMENTED);
  }
}
