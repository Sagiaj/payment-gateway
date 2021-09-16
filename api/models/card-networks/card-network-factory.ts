import CardNetwork from "./base";
import { CardNetworkType } from "./card-network-types";
import { Visa } from "./visa";

export default class CardNetworkFactory {

  static create(type: CardNetworkType): CardNetwork {
    let cardNetwork: CardNetwork;

    switch(type) {
      case CardNetworkType.Visa:
      default:
        cardNetwork = new Visa();
        break;
    }

    return cardNetwork;
  }
}