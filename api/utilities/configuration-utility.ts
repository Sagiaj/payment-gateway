import { readFileSync } from "fs";
import SecretsManagerProvider from "../providers/secrets-manager-provider";

export default class ConfigurationUtility {

  static async getConfiguration() {
    const method_name = `ConfigurationUtility/getConfiguration`;
    AppLogger.info(`ConfigurationUtility`, `${method_name} - start`);
    try {
      if (initConfig && !initConfig.fetch_from_remote && initConfig.dev && initConfig.dev.app_config) {
        AppLogger.verbose("ConfigurationUtility", "Returning local file configuration.");
        return initConfig.dev.app_config;
      }
      let config = null;

      if (initConfig && initConfig.app_config_secret_name && initConfig.fetch_from_remote) {
        AppLogger.verbose("ConfigurationUtility", "calling SecretsManagerProvider/getsecretValue.");
        config = await SecretsManagerProvider.getSecretValue("ConfigurationUtility", initConfig.app_config_secret_name);
        config = JSON.parse(config);
      }

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
      config = await ConfigurationUtility.getConfiguration();
      global["Globals"] = config;

      return config;
    } catch (err) {
      AppLogger.error(`ConfigurationUtility`, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
}
