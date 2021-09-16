export class ErrorCodes {
  static get ERROR_INVALID_SIGNATURE(): string {
    return "ERROR_INVALID_SIGNATURE";
  }
  static get ERROR_APPLICATION_BOOTSTRAP_FAILURE(): string {
    return "ERROR_APPLICATION_BOOTSTRAP_FAILURE";
  }
  static get GENERAL_ERROR(): string {
    return "GENERAL_ERROR";
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
  static get ERROR_ROLLBACK_NULL_CONNECTION(): string {
    return "ERROR_ROLLBACK_NULL_CONNECTION";
  }
  static get ERROR_MTI_MESSAGE(): string {
    return "ERROR_MTI_MESSAGE";
  }
  static get ERROR_GET_MTI_MESSAGE_TYPE(): string {
    return "ERROR_GET_MTI_MESSAGE_TYPE";
  }
  static get ERROR_SECRETS_MANAGER_GET_SECRET_VALUE(): string {
    return "ERROR_SECRETS_MANAGER_GET_SECRET_VALUE";
  }
  static get ERROR_PARSE_CARD_MESSAGE_HEADER(): string {
    return "ERROR_PARSE_CARD_MESSAGE_HEADER";
  }
  static get ERROR_PARSE_CARD_MESSAGE_MTI(): string {
    return "ERROR_PARSE_CARD_MESSAGE_MTI";
  }
  static get ERROR_MTI_VERSION_MISMATCH_1987(): string {
    return "ERROR_MTI_VERSION_MISMATCH_1987";
  }
  static get ERROR_MTI_BAD_MESSAGE_CLASS(): string {
    return "ERROR_MTI_BAD_MESSAGE_CLASS";
  }
  static get ERROR_PARSE_CARD_MESSAGE_BITMAP(): string {
    return "ERROR_PARSE_CARD_MESSAGE_BITMAP";
  }
  static get ERROR_PARSE_CARD_MESSAGE_DATA_ELEMENTS(): string {
    return "ERROR_PARSE_CARD_MESSAGE_DATA_ELEMENTS";
  }
  static get ERROR_PARSE_CARD_MESSAGE_TRAILER(): string {
    return "ERROR_PARSE_CARD_MESSAGE_TRAILER";
  }
  static get ERROR_AUTHORIZED_CARD_PAYMENT(): string {
    return "ERROR_AUTHORIZED_CARD_PAYMENT";
  }
  static get NOT_IMPLEMENTED(): string {
    return "NOT_IMPLEMENTED";
  }
  static get ERROR_GET_MERCHANT_CLIENT_TOKEN(): string {
    return "ERROR_GET_MERCHANT_CLIENT_TOKEN";
  }
  static get ERROR_BAD_PROVIDER_NAME(): string {
    return "ERROR_BAD_PROVIDER_NAME";
  }
  static get ERROR_PROVIDER_CONFIGURATION(): string {
    return "ERROR_PROVIDER_CONFIGURATION";
  }
  static get ERROR_PROVIDER_ACTION(): string {
    return "ERROR_PROVIDER_ACTION";
  }
  static get ERROR_BAD_PROVIDER_ACTION_NAME(): string {
    return "ERROR_BAD_PROVIDER_ACTION_NAME";
  }
  static get ERROR_WH_PROCESS_3DS_VERSION(): string {
    return "ERROR_WH_PROCESS_3DS_VERSION";
  }
  static get ERROR_WH_GATEWAY_ACTION(): string {
    return "ERROR_WH_GATEWAY_ACTION";
  }
  static get ERROR_WH_PROCESS_ACS_CHALLENGE(): string {
    return "ERROR_WH_PROCESS_ACS_CHALLENGE";
  }
  static get ERROR_WH_PROCESS_3DS_COMPLETE(): string {
    return "ERROR_WH_PROCESS_3DS_COMPLETE";
  }

  static getErrorMessage(status_code: string): string {
    if (ErrorCodes[status_code]) {
      return ErrorCodes[status_code];
    } else {
      throw ErrorCodes.UNRECOGNIZED_ERROR;
    }
  }
}
