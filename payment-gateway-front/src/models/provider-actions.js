"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderActions;
(function (ProviderActions) {
    ProviderActions["Submit"] = "Submit";
    ProviderActions["CheckVersion"] = "Check Version";
    ProviderActions["NotifyACS"] = "Notify ACS";
    ProviderActions["InitiateAuthentication"] = "Initiate Authentication";
    ProviderActions["MandateChallenge"] = "Mandate Challenge";
})(ProviderActions = exports.ProviderActions || (exports.ProviderActions = {}));
;
var ProviderPaymentStatuses;
(function (ProviderPaymentStatuses) {
    ProviderPaymentStatuses["PaymentSuccessful"] = "PaymentSuccessful";
    ProviderPaymentStatuses["PaymentFailed"] = "PaymentFailed";
    ProviderPaymentStatuses["AuthenticationFailed"] = "AuthenticationFailed";
    ProviderPaymentStatuses["ChallengeFailed"] = "ChallengeFailed";
})(ProviderPaymentStatuses = exports.ProviderPaymentStatuses || (exports.ProviderPaymentStatuses = {}));
;
exports.ProviderTexts = (_a = {},
    _a[ProviderActions.Submit] = "Sending card data to gateway provider...",
    _a[ProviderActions.CheckVersion] = "Verifying 3DS version compatibility...",
    _a[ProviderActions.NotifyACS] = "Notifying ACS server of the transaction...",
    _a[ProviderActions.InitiateAuthentication] = "Authenticating card data...",
    _a[ProviderActions.MandateChallenge] = "Awaiting the card holder's validation...",
    _a[ProviderPaymentStatuses.PaymentSuccessful] = "Payment has been authorized by 3DS process",
    _a[ProviderPaymentStatuses.PaymentFailed] = "Payment could not be completed. See console for more details",
    _a[ProviderPaymentStatuses.AuthenticationFailed] = "Card holder did not complete authentication successfully",
    _a[ProviderPaymentStatuses.ChallengeFailed] = "Card holder failed 3DS authentication",
    _a);
//# sourceMappingURL=provider-actions.js.map