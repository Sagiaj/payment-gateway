import { readFileSync } from "fs";

export default class ConfigurationUtility {

  static async getConfiguration() {
    const method_name = `ConfigurationUtility/getConfiguration`;
    try {
      AppLogger.info(`ConfigurationUtility`, `${method_name} - start`);
      const config = require("../../config.json");
      return config;
    } catch (err) {
      AppLogger.error(`${method_name}`)
      return Promise.reject(err);
    }
  }

  static async initializeConfiguration() {
    const method_name = `ConfigurationUtility/initializeConfiguration`;
    AppLogger.info(`ConfigurationUtility`, `${method_name} - start`);
    try {
      let config = {};
      config = ConfigurationUtility.getConfiguration();
      return config;
    } catch (err) {
      AppLogger.error(`ConfigurationUtility`, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
}
