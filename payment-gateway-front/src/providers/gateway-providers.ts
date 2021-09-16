const crypto = require("crypto");
import { ThreeDSState } from "../store/modules/threeds";
import * as GlobalPayThreeDS from "globalpayments-3ds";
import { AuthenticationRequestType, AuthenticationSource, ChallengeRequestIndicator, ChallengeWindowSize, ICheckVersionRequestData, ICreditCardData, IInitiateAuthenticationRequestData, MessageCategory, MethodUrlCompletion, TransactionStatus, TransactionStatusReason } from "globalpayments-3ds";
import apiProvider from "./api-provider";
import axios from "axios";
import ThreeDSHtmlUtilities from "@/utilities/threeds-html-utilities";
import { TransactionData } from "@/store/modules/transaction-data";
type Complete<T> = {
  [P in keyof T]: undefined extends Pick<T, P> ? any : T[P];
}
export type OptionalToNullable<O> = {
  [K in keyof O]-?: undefined extends O[K] ? NonNullable<O[K]> : O[K] & string;
};

export interface IInitiateAuthenticationResponseDataJSON {
  acs_reference_number: string;
  acs_rendering_type: object;
  acs_trans_id: string;
  authentication_source: string;
  authentication_type: string;
  ds_trans_id: string;
  message_category: string;
  message_version: string;
  server_trans_id: string;
  status: GlobalPayThreeDS.IInitiateAuthenticationResponseData["status"];
  /* CHALLENGE FLOW FIELDS */
  challenge_mandated?: boolean;
  challenge_request_url?: string;
  encoded_creq?: string;
  /* FRICTIONLESS FLOW FIELDS */
  authentication_value?: string;
  eci?: string;
  status_reason?: TransactionStatusReason;
  /* CUISTOM FIELDS */
  transaction_id: string;
}


export enum GatewatProviderActions {
  Check3DSVersion = "Check3DSVersion",
  Initiate3DSAuthentication = "Initiate3DSAuthentication",
  Obtain3DSAuthenticationData = "Obtain3DSAuthenticationData",
  authorize3DSPayment = "authorize3DSPayment"
};

export class GlobalpayProvider {
  static provider_name: string = "globalpay";

  static get checkVersionEndpoint(): string {
    return `/merchants/${this.provider_name}/actions/${GatewatProviderActions.Check3DSVersion}`;
  }
  
  static initiateAuthenticationEndpoint(): string {
    return `/merchants/${this.provider_name}/actions/${GatewatProviderActions.Initiate3DSAuthentication}`;
  }
  
  static obtain3DSAuthenticationDataEndpoint(): string {
    return `/merchants/${this.provider_name}/actions/${GatewatProviderActions.Obtain3DSAuthenticationData}`;
  }

  static async checkVersion(cardFields: ICreditCardData, window_dialog_event_fn: Function, origin?: string): Promise<GlobalPayThreeDS.ICheckVersionResponseData> {
    try {
      console.log("GlobalPayThreeDS/checkVersion - start");
      const checkVersionRequestData: ICheckVersionRequestData = { card: { number: cardFields.number } };
      let versionCheckData: GlobalPayThreeDS.ICheckVersionResponseData = await apiProvider.performProviderAction(this.provider_name, GatewatProviderActions.Check3DSVersion, checkVersionRequestData);

      await window_dialog_event_fn();

      if (versionCheckData && versionCheckData.methodUrl) {
        await ThreeDSHtmlUtilities.postToIframe(
          versionCheckData.methodUrl,
          [{ type: "hidden", name: "threeDSMethodData", value: `${versionCheckData.methodData}` }],
          { displayMode: "embedded", windowSize: ChallengeWindowSize.Windowed600x400, origin: origin, zIndex: 0 }
        );
      }
      
      console.log("Finished GlobalPayThreeDS/checkVersion. result=", versionCheckData);
      return versionCheckData;
    } catch (err) {
      console.log(`Failed check version call. Error=`, err);
      return Promise.reject(err);
    }
  }
  
  static async initAuthentication(versionCheckData: GlobalPayThreeDS.ICheckVersionResponseData, cardFields: ICreditCardData, transactionData: TransactionData): Promise<IInitiateAuthenticationResponseDataJSON> {
    try {
      const browserData = GlobalPayThreeDS.getBrowserData();
      const initAuthRequestData: IInitiateAuthenticationRequestData & { transactionData: TransactionData } = {
        methodUrlComplete: MethodUrlCompletion.Yes,
        challengeWindow: {
          windowSize: ChallengeWindowSize.FullScreen,
          displayMode: "redirect"
        },
        serverTransactionId: versionCheckData.serverTransactionId,
        card: cardFields,
        browserData,
        authenticationSource: AuthenticationSource.Browser,
        authenticationRequestType: AuthenticationRequestType.PaymentTransaction,
        messageCategory: MessageCategory.Payment,
        challengeRequestIndicator: ChallengeRequestIndicator.NoPreference,
        transactionData
      };
      const authenticatedData: IInitiateAuthenticationResponseDataJSON = await apiProvider.performProviderAction(this.provider_name, GatewatProviderActions.Initiate3DSAuthentication, initAuthRequestData)
      .catch(err => {
        console.log("Failed initiateAuthentication. Error=", err.reasons);
        return Promise.reject(err);
      });

      console.log("Initiate authentication response=", authenticatedData);
      return authenticatedData;
    } catch (err) {
      console.log(`Failed check version call. Error=`, err);
      return Promise.reject(err);
    }
  }

  static async obtain3DSAuthenticationData(threeDSServerTransID: string) {
    try {
      const threeDSAuthenticationData = await apiProvider.performProviderAction(this.provider_name, GatewatProviderActions.Obtain3DSAuthenticationData, { threeDSServerTransID })
      return threeDSAuthenticationData;
    } catch (err) {
      console.log("GlobalPayProvider/obtain3DSAuthenticationData - failed to obtain 3ds Authentication data. error=", err);
      return Promise.reject(err);
    }
  }
  
  static async authorize3DSPayment(authentication_data: any, card: any, transaction_data: any) {
    try {
      const authorize3DSPaymentResponse = await apiProvider.performProviderAction(this.provider_name, GatewatProviderActions.authorize3DSPayment, { authentication_data, card, transaction_data })
      return authorize3DSPaymentResponse;
    } catch (err) {
      console.log("GlobalPayProvider/authorize3DSPayment - failed to obtain 3ds Authentication data. error=", err);
      return Promise.reject(err);
    }
  }

  static async startThreeDSProcess(cardFields: ICreditCardData) {
    try {
      const browserData = GlobalPayThreeDS.getBrowserData();

      let versionCheckData: GlobalPayThreeDS.ICheckVersionResponseData;
      try {
        // CREATE HIDDEN FORM WITH JSON OBJECT
        console.log("Calling GlobalPayThreeDS/checkVersion");
        const checkVersionRequestData: ICheckVersionRequestData = { card: { number: cardFields.number } };
        versionCheckData = await apiProvider.performProviderAction("globalpay", "Check3DSVersion", checkVersionRequestData);
        console.log("Finished GlobalPayThreeDS/checkVersion. result=", versionCheckData);
        console.log("calling ACS");
        GlobalpayProvider.createAndSubmitHiddenForm("POST", `${versionCheckData.methodUrl}`, "hidden_iframe", [{ type: "hidden", name: "threeDSMethodData", value: `${versionCheckData.methodData}` }]);
      } catch (err) {
        console.log("Errored in posting to ACS. Error=", err["reasons"]);
        versionCheckData = JSON.parse("null");
      }

      if (!versionCheckData) return;
      const initAuthUrl = `http://localhost:3333/merchants/globalpay/actions/Initiate3DSAuthentication`;
      const initAuthRequestData: IInitiateAuthenticationRequestData = {
        methodUrlComplete: MethodUrlCompletion.Yes,
        challengeWindow: {
          windowSize: ChallengeWindowSize.FullScreen,
          displayMode: "lightbox"
        },
        serverTransactionId: versionCheckData.serverTransactionId,
        card: cardFields,
        browserData,
        authenticationSource: AuthenticationSource.Browser,
        authenticationRequestType: AuthenticationRequestType.PaymentTransaction,
        messageCategory: MessageCategory.Payment,
        challengeRequestIndicator: ChallengeRequestIndicator.NoPreference
      };
      const authenticatedData: IInitiateAuthenticationResponseDataJSON = (await
        axios.post(initAuthUrl, initAuthRequestData).catch(err => {
          console.log("Failed initiateAuthentication. Error=", err.reasons);
          return Promise.reject(err);
        })).data;
      console.log("Initiate authentication response=", authenticatedData);

      if (authenticatedData.challenge_mandated) {
        console.log("Calling Challenge flow");
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", `${authenticatedData.challenge_request_url}`);
        form.setAttribute("target", "iframe");

        var creqData = document.createElement("input");
        creqData.setAttribute("type", "hidden");
        creqData.setAttribute("name", "creq");
        //add creq object obtained from the server
        creqData.setAttribute("value", `${authenticatedData.encoded_creq}`);
        form.appendChild(creqData);

        /* optional parameter to include Session Data
        var sessionData = document.createElement("input");
        sessionData.setAttribute("type", "hidden");
        sessionData.setAttribute("name", "threeDSSessionData");
        creqDatasetAttribute("value", sessionDataObject);
        form.appendChild(sessionData);
        */

        document.body.appendChild(form);

        console.log("Submitting hidden form");
        form.submit();
      }
    } catch (err) {
      console.log(`Failed 3D Secure process. Error=`, err);
      return Promise.reject(err);
    }
  }

  static createAndSubmitHiddenForm(method: "POST" | "GET", action: string, target: string, inputAttributes: { type: string, name: string, value: string }[]) {
    const form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", action);
    form.setAttribute("target", target);
    
    for (let attribute of inputAttributes) {
      const threeDSMethodDataInput = document.createElement("input");
      threeDSMethodDataInput.setAttribute("type", attribute.type);
      threeDSMethodDataInput.setAttribute("name", attribute.name);
      threeDSMethodDataInput.setAttribute("value", attribute.value);
      form.appendChild(threeDSMethodDataInput);
    }
    document.body.appendChild(form);
    form.submit();
  }

  static paymentTransactionStatusIsTerminal(status: TransactionStatus) {
    return status !== TransactionStatus.ChallengeRequired;
  }
}


export function convertToGlobalPayCardFields(cardDetails: ThreeDSState["cardData"]): ICreditCardData {
  const globalPayCardObject = <ICreditCardData>{
    request_timestamp: new Date().toISOString(),
    cardHolderName: cardDetails.cardName,
    cvn: cardDetails.cardCvv,
    customerReference: "SANDBOX_REFERENCE",
    expMonth: cardDetails.cardMonth,
    expYear: cardDetails.cardYear,
    number: cardDetails.cardNumberNotMask ? cardDetails.cardNumberNotMask.trim().replace(/\s+/g, "") : "",
    reference: "INTERNAL_SANDBOX_REFERENCE"
  };
  
  return globalPayCardObject;
}

