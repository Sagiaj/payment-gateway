import { ErrorCodes } from "../error-codes";

export default class StringUtility {
  static convertBase(correlation_id: string, input: string | number, from_base: number, to_base: number, pad_limit: number = 4, pad_character: string = "0"): string {
    const method_name = "StringUtility/convertBase";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const outputValues = [];
      const inputValues = [];
      let resultString = '';
      let pos = 0;
      const normalizedInput = String(input).split(/[^0-9a-zA-Z]+/g).join("");
      for (let i = 0; i < normalizedInput.length; i++) {
        inputValues[i] = parseInt(normalizedInput.charAt(i), from_base);
      }
      while (pos < inputValues.length) {
        let remainder = 0;
        for (let i = pos; i < inputValues.length; i++) {
          remainder = inputValues[i] + remainder * from_base;
          inputValues[i] = Math.floor(remainder / to_base);
          remainder -= inputValues[i] * to_base;
          if (inputValues[i] == 0 && i == pos) pos++;
        }
        outputValues.push(remainder);
      }

      let i = outputValues.length - 1;
      while(i >= 0) {
        resultString += outputValues[i--].toString(to_base);
      }
      AppLogger.info(correlation_id, `${method_name} - end`);
      return resultString.padStart(pad_limit, pad_character);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error;`, err);
      throw ErrorCodes.GENERAL_ERROR;
    }
  }
}
