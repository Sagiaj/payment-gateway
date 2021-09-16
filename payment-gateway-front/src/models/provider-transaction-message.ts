import { TransactionStatus, TransactionStatusReason } from "globalpayments-3ds";
import { ProviderActions, ProviderPaymentStatuses, ProviderTexts } from "./provider-actions";
export type TransactionMessageType = "error" | "info" | "warning" | "success" | null;

export default class TransactionMessage {
  message_type: TransactionMessageType = null;
  message_text: string = "";
  constructor(status?: TransactionStatus, reason?: TransactionStatusReason) {
    switch(status) {
      case TransactionStatus.AuthenticationAttemptedButNotSuccessful:
        this.message_type = "error";
        break;
      case TransactionStatus.AuthenticationCouldNotBePerformed:
        this.message_type = "error";
        break;
      case TransactionStatus.AuthenticationFailed:
        this.message_type = "error";
        break;
      case TransactionStatus.AuthenticationIssuerRejected:
        this.message_type = "error";
        break;
      case TransactionStatus.AuthenticationSuccessful:
        this.message_type = "success";
        break;
      case TransactionStatus.ChallengeRequired:
        this.message_type = "warning";
        break;
      default:
        this.message_type =  "error";
        return;
    }

    this.message_text = reason || "";
  }

  static statusToActionText<T extends keyof typeof ProviderTexts>(status: TransactionStatus): typeof ProviderTexts[T] {
    let mapped_key: keyof typeof ProviderTexts = ProviderActions.Submit;
    switch (status) {
      case TransactionStatus.AuthenticationAttemptedButNotSuccessful:
      case TransactionStatus.AuthenticationCouldNotBePerformed:
      case TransactionStatus.AuthenticationFailed:
      case TransactionStatus.AuthenticationIssuerRejected:
        mapped_key = ProviderPaymentStatuses.AuthenticationFailed;
        break;
        case TransactionStatus.ChallengeRequired:
        mapped_key = ProviderActions.MandateChallenge;
        break;
      case TransactionStatus.AuthenticationSuccessful:
        mapped_key = ProviderPaymentStatuses.PaymentSuccessful;
        break;
      default:
        mapped_key = ProviderPaymentStatuses.ChallengeFailed;
        break;
    }
    return ProviderTexts[mapped_key];
  }
  
  static statusReasonToProviderText<T extends keyof typeof ProviderTexts>(reason: TransactionStatusReason): typeof ProviderTexts[T] {
    let mapped_key: keyof typeof ProviderTexts = ProviderActions.Submit;
    switch (reason) {
      case TransactionStatusReason.CardAuthenticationFailed:
      case TransactionStatusReason.UnknownDevice:
      case TransactionStatusReason.UnsupportedDevice:
      case TransactionStatusReason.ExceedsAuthenticationFrequencyLimit:
      case TransactionStatusReason.SecurityFailure:
      case TransactionStatusReason.StolenCard:
      case TransactionStatusReason.SuspectedFraud:
        mapped_key = ProviderPaymentStatuses.AuthenticationFailed;
        break;
      case TransactionStatusReason.ExpiredCard:
      case TransactionStatusReason.InvalidCardNumber:
      case TransactionStatusReason.InvalidTransaction:
      case TransactionStatusReason.NoCardRecord:
      case TransactionStatusReason.TransactionNotPermittedToCardholder:
      case TransactionStatusReason.CardholderNotEnrolledInService:
      case TransactionStatusReason.NonPaymentTransactionNotSupported:
      case TransactionStatusReason.ThreeriTransactionNotSupported:
        mapped_key = ProviderPaymentStatuses.PaymentFailed;
        break;
      case TransactionStatusReason.TransactionTimedOutAtTheAcs:
      case TransactionStatusReason.ExceedsAcsMaximumChallenges:
        mapped_key = ProviderPaymentStatuses.ChallengeFailed;
        break;
      case TransactionStatusReason.LowConfidence:
      case TransactionStatusReason.MediumConfidence:
      case TransactionStatusReason.HighConfidence:
      case TransactionStatusReason.VeryHighConfidence:
        mapped_key = ProviderPaymentStatuses.PaymentSuccessful;
        break;
      default:
        mapped_key = ProviderPaymentStatuses.ChallengeFailed;
        break;
    }

    return ProviderTexts[mapped_key];
  }
}