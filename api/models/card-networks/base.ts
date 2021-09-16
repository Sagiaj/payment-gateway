import { IAuthorizationRequest, IAuthorizationResponse } from "../contracts/authorization";
import { CardNetworkType } from "./card-network-types";

export default abstract class CardNetwork {
  name: string;
  prefix_code: number;
  allowed_lengths: number[];
  network_type: CardNetworkType;
  authorization_request: IAuthorizationRequest;
  authorization_response: IAuthorizationResponse;
}
