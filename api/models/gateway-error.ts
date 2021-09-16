import { ErrorCodes } from "../error-codes";

export default class GatewayError {
  error_code: string;
  message: string;
  data: any;
  status: number;

  static parseGatewayError(error_code: string, status: number, data: any): GatewayError {
    let gw_err = new GatewayError();

    gw_err.error_code = error_code;
    gw_err.message = ErrorCodes.getErrorMessage(error_code);
    gw_err.data = data;
    gw_err.status = status;

    return gw_err;
  }
}
