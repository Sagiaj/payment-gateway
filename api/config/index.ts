import { Express } from "express";
import { readFileSync } from "fs";
import { ErrorCodes } from "../error-codes";
import { json as bodyParser } from "body-parser";
import ConfigurationUtility from "../utilities/configuration-utility";

export const bootstrapApplication = async (expressApp: Express): Promise<Express> => {
  try {
    global["AppLogger"] = {
      silly: (correlation_id: string, ...params: any) => console.log(correlation_id, ...params),
      info: (correlation_id: string, ...params: any) => console.info(correlation_id, ...params),
      verbose: (correlation_id: string, ...params: any) => console.log(correlation_id, ...params),
      error: (correlation_id: string, ...params: any) => console.error(correlation_id, ...params)
    };

    expressApp.use(bodyParser());

    // Global
    let config = await ConfigurationUtility.initializeConfiguration();
    if (config && config["dev"]) {
      config = { ...config, ...config["dev"] };
    }
    global["Globals"] = config;
    return expressApp;
  } catch (err) {
    AppLogger.error("bootstrapApplication", `Failed to bootstrap application. error:`, err);
    return Promise.reject(ErrorCodes.ERROR_APPLICATION_BOOTSTRAP_FAILURE);
  }
}