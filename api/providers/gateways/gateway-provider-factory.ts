import { ErrorCodes } from "../../error-codes";
import { BaseGatewayProvider } from "./base-gateway-provider";
import { BluesnapProvider } from "./bluesnap/bluesnap-provider";
import { BraintreeProvider } from "./braintree/braintree-provider";
import { GlobalpayProvider } from "./globalpay/globalpay-provider";
import { PaysafeProvider } from "./paysafe/paysafe-provider";

export class GatewayProviderFactory {
  static GatewayProviders = {
    Bluesnap: "bluesnap",
    GlobalPay: "globalpay",
    BrainTree: "braintree",
    Paysafe: "paysafe"
  };

  static create(correlation_id: string, provider_name: string): BaseGatewayProvider {
    const method_name = `GatewayProviderFactory/create`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      let provider: BaseGatewayProvider;
      switch (provider_name) {
        case GatewayProviderFactory.GatewayProviders.GlobalPay:
          provider = new GlobalpayProvider();
          break;
        case GatewayProviderFactory.GatewayProviders.Bluesnap:
          provider = new BluesnapProvider();
          break;
        case GatewayProviderFactory.GatewayProviders.BrainTree:
          provider = new BraintreeProvider();
          break;
        case GatewayProviderFactory.GatewayProviders.Paysafe:
          provider = new PaysafeProvider();
          break;
        default:
          throw ErrorCodes.ERROR_BAD_PROVIDER_NAME;
          break;
      }

      AppLogger.info(correlation_id, `${method_name} - end`);
      return provider;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name}`)
    }
  }
}
