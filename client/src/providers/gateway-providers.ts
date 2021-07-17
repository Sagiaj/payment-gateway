const crypto = require("crypto");
import { ThreeDSState } from "../store/modules/threeds";
import * as GlobalPayThreeDS from "globalpayments-3ds";
import { AuthenticationRequestType, AuthenticationSource, ChallengeRequestIndicator, ChallengeWindowSize, ICheckVersionRequestData, IInitiateAuthenticationRequestData, MessageCategory, MethodUrlCompletion } from "globalpayments-3ds";
import * as NodePaysafe from "node-paysafe";
import apiProvider from "./api-provider";
import axios from "axios";
type Complete<T> = {
  [P in keyof T]: undefined extends Pick<T, P> ? any : T[P];
}
export type OptionalToNullable<O> = {
  [K in keyof O]-?: undefined extends O[K] ? NonNullable<O[K]> : O[K] & string;
};
export class PaysafeProvider {
  static async startThreeDSProcess<CD extends ThreeDSState["cardData"]>(card_data: OptionalToNullable<CD> ) {
    try {
      let crd = new NodePaysafe.Card();
      crd.holderName = card_data.cardName;
      const cardNumber = card_data.cardNumberNotMask ? card_data.cardNumberNotMask.trim().replace(/\s+/g, "") : "";
    } catch (err) {
      console.log(`Failed 3D Secure process. Error=`, err);
      return Promise.reject(err);
    }
  }
}


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
  status_reason?: string;
}



export class GlobalpayProvider {
  static async startThreeDSProcess<CD extends ThreeDSState["cardData"]>(card_data: CD) {
    try {
      const cardFields = convertToGlobalPayCardFields(card_data);
      const browserData = GlobalPayThreeDS.getBrowserData();
      
      const checkVersionRequestData: ICheckVersionRequestData = { card: { number: cardFields.number } };
      // console.log("calling apiprovider/performProviderAction");
      // const versionCheckData = await apiProvider.performProviderAction("globalpay", "Check3DSVersion", cardFields);

      const checkVersionUrl = `http://localhost:3333/merchants/globalpay/actions/Check3DSVersion`;
      let versionCheckData: GlobalPayThreeDS.ICheckVersionResponseData;
      try {
        console.log("Calling GlobalPayThreeDS/checkVersion");
        versionCheckData = await (await axios.post(checkVersionUrl, checkVersionRequestData)).data;
        // versionCheckData = await GlobalPayThreeDS.checkVersion(checkVersionUrl, requestData);
        var form = document.createElement("form");
        console.log("Finished GlobalPayThreeDS/checkVersion. result=", versionCheckData);
        console.log("calling ACS");
        form.setAttribute("method", "POST");
        form.setAttribute("action", `${versionCheckData.methodUrl}`);
        form.setAttribute("target", "hidden_iframe");
        
        var threeDSMethodDataInput = document.createElement("input");
        threeDSMethodDataInput.setAttribute("type", "hidden");
        threeDSMethodDataInput.setAttribute("name", "threeDSMethodData");
        // add the JSON object returned by Global Payments
        threeDSMethodDataInput.setAttribute("value", `${versionCheckData.methodData}`);
        form.appendChild(threeDSMethodDataInput);
        document.body.appendChild(form);
        form.submit();
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
}


function convertToGlobalPayCardFields(cardDetails: ThreeDSState["cardData"]): GlobalPayThreeDS.ICreditCardData {
  const globalPayCardObject = <GlobalPayThreeDS.ICreditCardData>{
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

