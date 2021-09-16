import { Request } from "express";

export abstract class BaseGatewayProvider {
  abstract getClientToken(correlation_id: string): Promise<string>;
  abstract getProviderConfiguration(correlation_id: string): Promise<any>;
  abstract performProviderAction(correlation_id: string, action_name: string, req: Request): Promise<any>;
}

export interface IBaseGatewayProviderWebhook extends BaseGatewayProvider {
  processGatewayAction(correlation_id: string, action_name: string, req: Request): Promise<any>;
}
