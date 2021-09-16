import { Request } from "express";
import { BaseGatewayProvider, IBaseGatewayProviderWebhook } from "../../providers/gateways/base-gateway-provider";
import { BraintreeProvider } from "../../providers/gateways/braintree/braintree-provider";
import { GatewayProviderFactory } from "../../providers/gateways/gateway-provider-factory";

export class GatewayService {
  static async getClientToken(correlation_id: string, provider_name: string): Promise<string> {
    const method_name = `GatewayService/getClientToken`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const provider = GatewayProviderFactory.create(correlation_id, provider_name);
      AppLogger.verbose(correlation_id, `${method_name} - calling BaseGatewayProvider/getClientToken`);
      const clientToken = await provider.getClientToken(correlation_id);
      AppLogger.info(correlation_id, `${method_name} - end. clientToken=${clientToken}`);
      return clientToken;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
  
  static async getProviderConfiguration(correlation_id: string, provider_name: string): Promise<string> {
    const method_name = `GatewayService/getProviderConfiguration`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayProviderFactory/create`);
      const provider = GatewayProviderFactory.create(correlation_id, provider_name);
      AppLogger.verbose(correlation_id, `${method_name} - calling BaseGatewayProvider/getProviderConfiguration`);
      const providerConfiguration = await provider.getProviderConfiguration(correlation_id);
      AppLogger.info(correlation_id, `${method_name} - end. providerConfiguration=${providerConfiguration}`);
      return providerConfiguration;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
  
  static async performProviderAction(correlation_id: string, provider_name: string, action_name: string, req: Request): Promise<string> {
    const method_name = `GatewayService/performProviderAction`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayProviderFactory/create`);
      const provider = GatewayProviderFactory.create(correlation_id, provider_name);
      AppLogger.verbose(correlation_id, `${method_name} - calling BaseGatewayProvider/performProviderAction`);
      const provider_result = await provider.performProviderAction(correlation_id, action_name, req);
      AppLogger.info(correlation_id, `${method_name} - end.`);
      return provider_result;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }

  static async processGatewayAction(correlation_id: string, provider_name: string, action_name: string, req: Request): Promise<any> {
    const method_name = `GatewayService/processGatewayAction`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      AppLogger.verbose(correlation_id, `${method_name} - calling GatewayProviderFactory/create`);
      const provider = <IBaseGatewayProviderWebhook>GatewayProviderFactory.create(correlation_id, provider_name);
      AppLogger.verbose(correlation_id, `${method_name} - calling BaseGatewayProvider/processGatewayAction`);
      const provider_result = await provider.processGatewayAction(correlation_id, action_name, req);
      AppLogger.info(correlation_id, `${method_name} - end.`);
      return provider_result;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
}
