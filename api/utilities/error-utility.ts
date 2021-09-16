import { ErrorCodes } from "../error-codes";

export default class ErrorUtility {
  static logErrors(correlation_id: string, caller_origin: string, errors: ErrorCodes[]) {
    const method_name = `ErrorUtility/logErrors`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      for (let error of errors) {
        AppLogger.error(correlation_id, `${caller_origin} - error:`, error);
      }
    } catch (err) {
      AppLogger.info(correlation_id, `${method_name} - error:`, err);
    }
  }
}