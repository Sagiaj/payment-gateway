import axios, { AxiosError } from "axios";
import { v4 as uuid } from "uuid";
import { Request } from "express";
import { ErrorCodes } from "../../../error-codes";
import CryptoProvider from "../../crypto-provider";
import { BaseGatewayProvider, IBaseGatewayProviderWebhook } from "../base-gateway-provider";
import { GatewayProviderFactory } from "../gateway-provider-factory";
import { GlobalpayConfig } from "./globalpay-config";
// import * as GlobalPay from "globalpayments-api";
import * as GlobalPayThreeDS from "globalpayments-3ds";

export enum ProviderActions {
  Check3DSVersion = "Check3DSVersion",
  Initiate3DSAuthentication = "Initiate3DSAuthentication"
};

export enum ProviderWebhookActions {
  MethodURLNotification = "method-url-notification",
  ThreeDSComplete = "3ds-complete",
  ACSComplete = "acs-complete",
};

export class GlobalpayProvider extends BaseGatewayProvider implements IBaseGatewayProviderWebhook {
  private config = Globals.gateways_config.globalpay;

  async getClientToken(correlation_id: string): Promise<string> {
    const method_name = "GlobalpayProvider/getClientToken";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.error(correlation_id, `${method_name} - ${ErrorCodes.NOT_IMPLEMENTED}`);
    return Promise.reject(ErrorCodes.NOT_IMPLEMENTED);
  }

  async getProviderConfiguration(correlation_id: string): Promise<any> {
    const method_name = `GlobalpayProvider/getProviderConfiguration`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const config = this.config;
      const base_wh_url = `${Globals.webhooks.base_url}/${GatewayProviderFactory.GatewayProviders.GlobalPay}`;
      let providerConfiguration = {
        endpoints: config.endpoints,
        challengeNotificationUrl: `${base_wh_url}${Globals.webhooks.endpoints.wh_acs_challenge_complete_endpoint}`,
        reference_number: config.visa_3ds_reference_number,
        merchant_id: config.merchant_id,
        base_url: config.base_url,
        webhooks: {
          wh_3ds_version_check_endpoint: `${base_wh_url}${Globals.webhooks.endpoints.wh_3ds_method_url_notification_endpoint}`,
          wh_3ds_method_complete_endpoint: `${base_wh_url}${Globals.webhooks.endpoints.wh_3ds_method_complete_endpoint}`,
          wh_acs_challenge_complete_endpoint: `${base_wh_url}${Globals.webhooks.endpoints.wh_acs_challenge_complete_endpoint}`
        }
      };

      AppLogger.info(correlation_id, `${method_name} - end. returning providerConfiguration=`, providerConfiguration);
      return providerConfiguration;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name}`)
      return Promise.reject(ErrorCodes.ERROR_PROVIDER_CONFIGURATION)
    }
  }

  
  async performProviderAction(correlation_id: string, action_name: string, req: Request): Promise<any> {
    const method_name = "GlobalpayProvider/performProviderAction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      let result;
      const body = req.body;
      switch(action_name) {
        case ProviderActions.Check3DSVersion:
          const card_number = body["card"]["number"];
          AppLogger.verbose(correlation_id, `${method_name} - calling GlobalpayProvider/check3DSVersion`);
          result = await this.check3DSVersion(correlation_id, this.config.merchant_id, card_number);
          break;
        case ProviderActions.Initiate3DSAuthentication:
          AppLogger.verbose(correlation_id, `${method_name} - calling GlobalpayProvider/Initiate3DSAuthentication`);
          result = await this.Initiate3DSAuthentication(correlation_id, req);
          break;
        default:
          console.log("in UNKNOWN. rejecting")
          return Promise.reject("Unknown Action name " + action_name);
      }

      AppLogger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - Failed provider action. Error=`, err);
      return Promise.reject(ErrorCodes.ERROR_PROVIDER_ACTION);
    }
  }

  async processGatewayAction(correlation_id: string, action_name: string, req: Request) {
    const method_name = "GlobalpayProvider/processGatewayAction";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.verbose(correlation_id, `${method_name} - input parameters: action_name=${action_name}`);
    try {
      let result;
      const body = req.body;
      let decoded_body;
      switch(action_name) {
        case ProviderWebhookActions.MethodURLNotification:
          decoded_body = JSON.parse(Buffer.from(body["threeDSMethodData"], "base64").toString("utf8"));
          AppLogger.info(correlation_id, `${method_name} - decoding MethodURLNotification webhook. decoded_body=`, decoded_body);
          result = JSON.stringify(decoded_body);
          break;
        case ProviderWebhookActions.ThreeDSComplete:
          console.log("in ThreeDSComplete. exiting")
          break;
        case ProviderWebhookActions.ACSComplete:
          decoded_body = JSON.parse(Buffer.from(body["cres"], "base64").toString("utf8"));
          AppLogger.info(correlation_id, `${method_name} - decoding ACSComplete webhook. decoded_body=`, decoded_body);
          result = JSON.stringify(decoded_body);
          break;
        default:
          return Promise.reject("Unknown Action name " + action_name);
      }

      AppLogger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - Failed provider action. Error=`, err);
      return Promise.reject(ErrorCodes.ERROR_PROVIDER_ACTION);
    }
  }

  private async check3DSVersion(correlation_id: string, merchant_id: string, card_number: string): Promise<string> {
    const method_name = "GlobalpayProvider/check3DSVersion";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      AppLogger.verbose(correlation_id, `${method_name} - calling GlobalpayProvider/generate3DSCheckVersionHash`);
      const base_wh_url = `${Globals.webhooks.base_url}/${GatewayProviderFactory.GatewayProviders.GlobalPay}`;
      const request_timestamp = new Date().toISOString().slice(0,-1);
      const securehash = this.generate3DSCheckVersionHash(correlation_id, merchant_id, card_number);
      let body = {
        request_timestamp,
        number: card_number,
        account_id: "internet",
        merchant_id,
        scheme: "VISA",
        method_notification_url: `${base_wh_url}${Globals.webhooks.endpoints.wh_3ds_method_url_notification_endpoint}`,
        challenge_notification_url: `${base_wh_url}${Globals.webhooks.endpoints.wh_acs_challenge_complete_endpoint}`
      };
      const response = await axios.post(`${this.config.base_url}${this.config.endpoints.threeds_check_version}`, body, {
        headers: {
          Authorization: securehash,
          "X-GP-VERSION": "2.2.0"
        }
      }).catch((err: AxiosError) => {
        AppLogger.error(correlation_id, `${method_name} - Failed checking 3DS Version. Error=`, err.message);
        return Promise.reject(err.message);
      });
      
      AppLogger.info(correlation_id, `${method_name} - end`, response.data);
      return JSON.stringify(<GlobalPayThreeDS.ICheckVersionResponseData>{
        enrolled: response.data["enrolled"],
        serverTransactionId: response.data["server_trans_id"],
        methodData: response.data["method_data"]["encoded_method_data"],
        methodUrl: response.data["method_url"],
        versions: {
          accessControlServer: {
            start: response.data["ds_protocol_version_start"],
            end: response.data["ds_protocol_version_end"]
          }
        }
      });
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} Error=`, err);
      return Promise.reject(err);
    }
  }
  
  private async Initiate3DSAuthentication(correlation_id: string, req: Request): Promise<string> {
    const method_name = "GlobalpayProvider/Initiate3DSAuthentication";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      let reqBody = req.body;
      const base_wh_url = `${Globals.webhooks.base_url}/${GatewayProviderFactory.GatewayProviders.GlobalPay}`;
      const request_timestamp = reqBody.card.request_timestamp;
      const server_trans_id = req.body["serverTransactionId"];
      AppLogger.verbose(correlation_id, `${method_name} - calling GlobalpayProvider/generateInitiateAuthenticationHash`);
      const securehash = this.generateInitiateAuthenticationHash(correlation_id, request_timestamp, this.config.merchant_id, req.body["card"]["number"], server_trans_id);
      let body = {
        request_timestamp,
        authentication_source: reqBody.authenticationSource,
        authentication_request_type: reqBody.authenticationRequestType,
        message_category: reqBody.messageCategory,
        message_version: "2.2.0",
        challenge_request_indicator: reqBody.challengeRequestIndicator,
        server_trans_id: reqBody.serverTransactionId,
        merchant_id: this.config.merchant_id,
        account_id: "internet",
        card_detail: {
            number: reqBody.card.number,
            scheme: "VISA",
            expiry_month: reqBody.card.expMonth,
            expiry_year: String(reqBody.card.expYear).slice(-2),
            full_name: reqBody.card.cardHolderName
        },
        order: {
            date_time_created: request_timestamp,
            amount: "100",
            currency: "EUR",
            id: uuid(),
            address_match_indicator: "false",
            shipping_address: {
              line1: "Apartment 852",
              line2: "Complex 741",
              line3: "House 963",
              city: "Chicago",
              postal_code: "50001",
              state: "IL",
              country: "840"
            }
        },
        payer: {
            email: "james.mason@example.com",
            billing_address: {
              line1: "Flat 456",
              line2: "House 456",
              line3: "Unit 4",
              city: "Halifax",
              postal_code: "W5 9HR",
              country: "826"
            },
            mobile_phone: {
              country_code: "44",
              subscriber_number: "7123456789"
            }
        },
        method_url_completion: reqBody.methodUrlComplete,
        browser_data: {
            accept_header: req.headers["accept"],
            color_depth: reqBody.browserData.colorDepth,
            java_enabled: reqBody.browserData.javaEnabled,
            javascript_enabled: reqBody.browserData.javascriptEnabled,
            language: reqBody.browserData.language,
            screen_height: reqBody.browserData.screenHeight,
            screen_width: reqBody.browserData.screenWidth,
            challenge_window_size: reqBody.challengeWindow.windowSize,
            user_agent: reqBody.browserData.userAgent
        },
        method_notification_url: `${base_wh_url}${Globals.webhooks.endpoints.wh_3ds_method_url_notification_endpoint}`,
        challenge_notification_url: `${base_wh_url}${Globals.webhooks.endpoints.wh_acs_challenge_complete_endpoint}`
      };

      const response = await axios.post(`${this.config.base_url}${this.config.endpoints.init_authentication}`, body, {
        headers: {
          Authorization: securehash,
          "X-GP-VERSION": "2.2.0"
        }
      }).catch((err: AxiosError) => {
        AppLogger.error(correlation_id, `${method_name} - Failed Initiating 3ds authentication. Error=`, err.message, err.response && err.response.data);
        return Promise.reject(err.message);
      });
      
      AppLogger.info(correlation_id, `${method_name} - end`, response.data);
      return JSON.stringify(<GlobalPayThreeDS.IInitiateAuthenticationResponseData>response.data);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} Error=`, err);
      return Promise.reject(err);
    }
  }

  private generate3DSCheckVersionHash(correlation_id: string, merchant_id: string, card_number: string): string {
    const method_name = "GlobalpayProvider/generate3DSCheckVersionHash";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const request_timestamp = new Date().toISOString().slice(0,-1);
      AppLogger.verbose(correlation_id, `${method_name} - calling CryptoProvider/generateSHA1Hash`);
      const partial_hash = CryptoProvider.generateSHA1Hash(correlation_id, `${request_timestamp}.${merchant_id}.${card_number}`);
      AppLogger.verbose(correlation_id, `${method_name} - calling CryptoProvider/generateSHA1Hash`);
      const final_hash = CryptoProvider.generateSHA1Hash(correlation_id, `${partial_hash}.${Globals.gateways_config.globalpay.authentication.shared_secret}`);
      AppLogger.info(correlation_id, `${method_name} - end`);
      return `securehash ${final_hash}`;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} Error=`, err);
      throw err;
    }
  }
  
  private generateInitiateAuthenticationHash(correlation_id: string, request_timestamp: string, merchant_id: string, card_number: string, server_trans_id: string): string {
    const method_name = "GlobalpayProvider/generateInitiateAuthenticationHash";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      // const request_timestamp = new Date().toISOString().slice(0,-1);
      AppLogger.verbose(correlation_id, `${method_name} - calling CryptoProvider/generateSHA1Hash`);
      const partial_hash = CryptoProvider.generateSHA1Hash(correlation_id, `${request_timestamp}.${merchant_id}.${card_number}.${server_trans_id}`);
      AppLogger.verbose(correlation_id, `${method_name} - calling CryptoProvider/generateSHA1Hash`);
      const final_hash = CryptoProvider.generateSHA1Hash(correlation_id, `${partial_hash}.${Globals.gateways_config.globalpay.authentication.shared_secret}`);
      AppLogger.info(correlation_id, `${method_name} - end`);
      return `securehash ${final_hash}`;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} Error=`, err);
      throw err;
    }
  }
}
