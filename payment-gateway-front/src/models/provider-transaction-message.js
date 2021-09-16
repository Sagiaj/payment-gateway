"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalpayments_3ds_1 = require("globalpayments-3ds");
var TransactionMessage = /** @class */ (function () {
    function TransactionMessage(status, reason) {
        this.message_type = null;
        this.message_text = "";
        switch (status) {
            case globalpayments_3ds_1.TransactionStatus.AuthenticationAttemptedButNotSuccessful:
                this.message_type = "error";
                break;
            case globalpayments_3ds_1.TransactionStatus.AuthenticationCouldNotBePerformed:
                this.message_type = "error";
                break;
            case globalpayments_3ds_1.TransactionStatus.AuthenticationFailed:
                this.message_type = "error";
                break;
            case globalpayments_3ds_1.TransactionStatus.AuthenticationIssuerRejected:
                this.message_type = "error";
                break;
            case globalpayments_3ds_1.TransactionStatus.AuthenticationSuccessful:
                this.message_type = "success";
                break;
            case globalpayments_3ds_1.TransactionStatus.ChallengeRequired:
                this.message_type = "warning";
                break;
            default:
                this.message_type = "error";
                return;
        }
        this.message_text = reason || "";
    }
    return TransactionMessage;
}());
exports.default = TransactionMessage;
//# sourceMappingURL=provider-transaction-message.js.map