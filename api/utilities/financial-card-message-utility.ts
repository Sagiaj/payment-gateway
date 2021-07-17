import { ErrorCodes } from "../error-codes";

export const parseCardMessageHeader = (correlation_id: string, header: string) => {
  const method_name = "FinancialCardMessageUtility/parseCardMessageHeader";
  AppLogger.info(correlation_id, `${method_name} - start`);
  AppLogger.info(correlation_id, `${method_name} - input parameter: header=${header}`);
  try {
    
  } catch (err) {
    AppLogger.error(correlation_id, `${method_name} - error:`, err);
    throw ErrorCodes.ERROR_PARSE_CARD_MESSAGE_HEADER;
  }
}
export const parseCardMessageMTI = (correlation_id: string, mti: string) => {
  const method_name = "FinancialCardMessageUtility/parseCardMessageMTI";
  AppLogger.info(correlation_id, `${method_name} - start`);
  AppLogger.info(correlation_id, `${method_name} - input parameter: mti=${mti}`);
  try {
    
  } catch (err) {
    AppLogger.error(correlation_id, `${method_name} - error:`, err);
    throw ErrorCodes.ERROR_PARSE_CARD_MESSAGE_MTI;
  }
}
export const parseCardMessageBitmap = (correlation_id: string, bitmap: string) => {
  const method_name = "FinancialCardMessageUtility/parseCardMessageBitmap";
  AppLogger.info(correlation_id, `${method_name} - start`);
  AppLogger.info(correlation_id, `${method_name} - input parameter: bitmap=${bitmap}`);
  try {
    
  } catch (err) {
    AppLogger.error(correlation_id, `${method_name} - error:`, err);
    throw ErrorCodes.ERROR_PARSE_CARD_MESSAGE_BITMAP;
  }
}
export const parseCardMessageDataElements = (correlation_id: string, data_elements: string) => {
  const method_name = "FinancialCardMessageUtility/parseCardMessageDataElements";
  AppLogger.info(correlation_id, `${method_name} - start`);
  AppLogger.info(correlation_id, `${method_name} - input parameter: data_elements=${data_elements}`);
  try {
    
  } catch (err) {
    AppLogger.error(correlation_id, `${method_name} - error:`, err);
    throw ErrorCodes.ERROR_PARSE_CARD_MESSAGE_DATA_ELEMENTS;
  }
}
export const parseCardMessageTrailer = (correlation_id: string, trailer: string) => {
  const method_name = "FinancialCardMessageUtility/parseCardMessageTrailer";
  AppLogger.info(correlation_id, `${method_name} - start`);
  AppLogger.info(correlation_id, `${method_name} - input parameter: trailer=${trailer}`);
  try {
    
  } catch (err) {
    AppLogger.error(correlation_id, `${method_name} - error:`, err);
    throw ErrorCodes.ERROR_PARSE_CARD_MESSAGE_TRAILER;
  }
}