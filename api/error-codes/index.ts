export class ErrorCodes {
  static get ERROR_INVALID_SIGNATURE(): string {
    return "ERROR_INVALID_SIGNATURE";
  }
  static get ERROR_APPLICATION_BOOTSTRAP_FAILURE(): string {
    return "ERROR_APPLICATION_BOOTSTRAP_FAILURE";
  }
  static get ERROR_UNAUTHORIZED_3RD_PARTY(): string {
    return "ERROR_UNAUTHORIZED_3RD_PARTY";
  }
  static get UNRECOGNIZED_ERROR(): string {
    return "UNRECOGNIZED_ERROR";
  }
  static get MISSING_AUTHENTICATION_HEADERS(): string {
    return "MISSING_AUTHENTICATION_HEADERS";
  }
  static get ERROR_CREATE_CARD_PAYMENT(): string {
    return "ERROR_CREATE_CARD_PAYMENT";
  }
  static get ERROR_GET_MERCHANT_SECRET_KEY_BY_ACCESS_KEY(): string {
    return "ERROR_GET_MERCHANT_SECRET_KEY_BY_ACCESS_KEY";
  }

  static getErrorMessage(status_code: string): string {
    if (ErrorCodes[status_code]) {
      return ErrorCodes[status_code];
    } else {
      throw ErrorCodes.UNRECOGNIZED_ERROR;
    }
  }
}
