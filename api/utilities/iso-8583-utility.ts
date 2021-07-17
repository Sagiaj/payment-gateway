import { ErrorCodes } from "../error-codes";
import { MTITypes } from "../models/iso8583/types/mti";
import ErrorUtility from "./error-utility";

export class ISO8583Utility {
  static getMessageType(correlation_id: string, message: string) {
    const method_name = `ISO8583utility/getMessageType`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const mtiDigits = message.substr(0, 4).split("");
      const [version, message_class, message_sub_class, transaction_originator] = mtiDigits;
      let validation_errors = ISO8583Utility.validateMTIDigits(correlation_id, version, message_class, message_sub_class, transaction_originator);
      if (validation_errors && validation_errors.length > 0) {
        ErrorUtility.logErrors(correlation_id, method_name,  validation_errors);
        AppLogger.error(correlation_id, `${method_name} - failed to get message type`);
        throw ErrorCodes.ERROR_GET_MTI_MESSAGE_TYPE;
      }
      let curKey;
      let root = Object(MTITypes);
      while ( mtiDigits && mtiDigits.length && (curKey = mtiDigits.shift()) ) {
        if (root && root["x"] !== undefined) {
          root = root["x"];
        } else {
          root = root[curKey];
        }
      }
      return root;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      throw err;
    }
  }

  static validateMTIDigits(correlation_id: string, version: string, message_class: string, message_sub_class: string, transaction_originator: string): string[] {
    const method_name = `ISO8583utility/validateMTIDigits`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    const validation_errors = [];
    try {
      let current_tree_node = !MTITypes.x;
      if (version !== "0" || !version) {
        validation_errors.push(ErrorCodes.ERROR_MTI_VERSION_MISMATCH_1987);
      }
      if (current_tree_node) current_tree_node = current_tree_node[message_class];
      if (message_class === "0" || !message_class || !current_tree_node) {
        validation_errors.push(ErrorCodes.ERROR_MTI_BAD_MESSAGE_CLASS);
      }
      if (current_tree_node) current_tree_node = current_tree_node[message_sub_class];
      if (message_sub_class === "0" || !message_sub_class || !current_tree_node) {
        validation_errors.push(`Incorrect message sub class - ${message_sub_class}`);
      }
      if (current_tree_node) current_tree_node = current_tree_node[transaction_originator];
      if (["0", "1", "2", "3", "4", "5"].indexOf(transaction_originator) === -1 || !transaction_originator || !current_tree_node) {
        validation_errors.push(`Incorrect transaction originator - ${transaction_originator}`);
      }
      return validation_errors;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      throw err;
    }
  }
}
