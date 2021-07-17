import { BraintreeGateway, Environment } from "braintree";
import { Request } from "express";
import { ErrorCodes } from "../../../error-codes";
import { BaseGatewayProvider } from "../base-gateway-provider";

export class BraintreeProvider extends BaseGatewayProvider {
  async getProviderConfiguration(correlation_id: string) {
    throw new Error("Method not implemented.");
  }
  private gateway = new BraintreeGateway({
    environment: Environment.Sandbox,
    merchantId: Globals.gateways_config.braintree.merchant_id,
    publicKey: Globals.gateways_config.braintree.public_key,
    privateKey: Globals.gateways_config.braintree.private_key
  });

  async getClientToken(correlation_id: string): Promise<string> {
    const method_name = "BraintreeProvider/getClientToken";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      AppLogger.verbose(correlation_id, `${method_name} - generating client token`);
      const response = await this.gateway.clientToken.generate({ merchantAccountId: Globals.gateways_config.braintree.merchant_id });
      const { clientToken } = response;
      AppLogger.verbose(correlation_id, `${method_name} - client token response=`, response);
      AppLogger.info(correlation_id, `${method_name} - end. clientToken=${clientToken}`);
      return clientToken;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }

  async performProviderAction(correlation_id: string, action_name: string, req: Request) {
    const method_name = "BraintreeProvider/performProviderAction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.error(correlation_id, `${method_name} - ${ErrorCodes.NOT_IMPLEMENTED}`);
    return Promise.reject(ErrorCodes.NOT_IMPLEMENTED);
  }
}
