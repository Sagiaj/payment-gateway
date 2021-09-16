import CardNetwork from "../base";
import { VisaAuthorizationRequest, VisaAuthorizationResponse } from "./authorization";

export class Visa extends CardNetwork {
  constructor() {
    super();
    this.authorization_request = new VisaAuthorizationRequest();
    this.authorization_response = new VisaAuthorizationResponse();
  }
}
