import { Express } from "express";
import { ErrorCodes } from "../error-codes";
import ConfigurationUtility from "../utilities/configuration-utility";
import * as http from "http";
import { json, urlencoded } from "body-parser";
import cors from "cors";

export const bootstrapApplication = async (expressApp: Express): Promise<http.Server> => {
  try {
    global["AppLogger"] = {
      silly: (correlation_id: string, ...params: any) => console.log(correlation_id, ...params),
      info: (correlation_id: string, ...params: any) => console.info(correlation_id, ...params),
      verbose: (correlation_id: string, ...params: any) => console.log(correlation_id, ...params),
      error: (correlation_id: string, ...params: any) => console.error(correlation_id, ...params)
    };

    expressApp.use(urlencoded({ extended: false }));
    expressApp.use(json());
    expressApp.use(cors({
      preflightContinue: true,
      origin: (origin: string, callback) => {
        callback(null, origin);
      }
    }));

    if (!global["initConfig"]) {
      global["initConfig"] = require("../../config.json");
    }
    
    // Global
    await ConfigurationUtility.initializeConfiguration();
    const httpServer = http.createServer(expressApp);
    return httpServer;
  } catch (err) {
    AppLogger.error("bootstrapApplication", `Failed to bootstrap application. error:`, err);
    return Promise.reject(ErrorCodes.ERROR_APPLICATION_BOOTSTRAP_FAILURE);
  }
}