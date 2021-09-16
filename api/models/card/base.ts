import CardNetwork from "../card-networks/base";

export default abstract class BaseCard {
  card_network: CardNetwork;
  number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  expiration_day: string;
}
