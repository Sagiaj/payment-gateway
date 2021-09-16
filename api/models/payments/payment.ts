import { PaymentStatus, PaymentType } from "./types";

export class Payment {
  type: PaymentType = PaymentType.Card;
  status: PaymentStatus = PaymentStatus.Active;
  amount: string;
  currency_code: string;
  payment_method: {
    number: string,
    expiration_month: string,
    expiration_year: string
  };
}