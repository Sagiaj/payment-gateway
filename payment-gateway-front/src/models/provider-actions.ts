export enum ProviderActions {
  Submit = "Submit",
  CheckVersion = "Check Version",
  NotifyACS = "Notify ACS",
  InitiateAuthentication = "Initiate Authentication",
  MandateChallenge = "Mandate Challenge"
};

export enum ProviderPaymentStatuses {
  PaymentSuccessful = "PaymentSuccessful",
  PaymentFailed = "PaymentFailed",
  AuthenticationFailed = "AuthenticationFailed",
  ChallengeFailed = "ChallengeFailed"
};

export const ProviderTexts = {
  [ProviderActions.Submit]: "Sending card data to gateway provider...",
  [ProviderActions.CheckVersion]: "Verifying 3DS version compatibility...",
  [ProviderActions.NotifyACS]: "Notifying ACS server of the transaction...",
  [ProviderActions.InitiateAuthentication]: "Authenticating card data...",
  [ProviderActions.MandateChallenge]: "Awaiting the card holder's validation...",
  [ProviderPaymentStatuses.PaymentSuccessful]: "Payment has been authorized by 3DS process",
  [ProviderPaymentStatuses.PaymentFailed]: "Payment could not be completed. See console for more details",
  [ProviderPaymentStatuses.AuthenticationFailed]: "Card holder did not complete authentication successfully",
  [ProviderPaymentStatuses.ChallengeFailed]: "Card holder failed 3DS authentication"
};
