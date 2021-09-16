import { SecretsManager } from "aws-sdk";
import { ErrorCodes } from "../error-codes";

export default class SecretsManagerProvider {
  private static _secrets_manager: SecretsManager = null;

  private static getInstance(): SecretsManager {
    if (!this._secrets_manager) {
      this._secrets_manager = new SecretsManager({
        region: "eu-central-1"
      });
      if (initConfig && initConfig.dev && initConfig.dev.aws_access_key && initConfig.dev.aws_secret_key) {
        this._secrets_manager.config.update({
          region: "eu-central-1",
          credentials: {
            accessKeyId: initConfig.dev.aws_access_key,
            secretAccessKey: initConfig.dev.aws_secret_key
          }
        })
      }
    }

    return this._secrets_manager;
  }

  static async getSecretValue(correlation_id: string, secret_name: string) {
    const method_name = "SecretsManagerProvider/getSecretValue";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      let secret;
  
      const instance = await this.getInstance();
      const secretValue = await instance.getSecretValue({SecretId: secret_name}).promise();
      if ('SecretString' in secretValue) {
        secret = secretValue.SecretString;
      } else {
        if (secretValue && secretValue.SecretBinary && typeof secretValue.SecretBinary == "string") {
          let buff = Buffer.from(secretValue.SecretBinary, 'base64');
          secret = buff.toString('ascii');
        }
      }

      return secret;
    } catch (err) {
      if (err.code === 'DecryptionFailureException') {
          AppLogger.error(correlation_id, `${method_name} - error:`, "Secrets Manager can't decrypt the protected secret text using the provided KMS key.");
      }
      else if (err.code === 'InternalServiceErrorException') {
          AppLogger.error(correlation_id, `${method_name} - error:`, "An error occurred on the server side.");
      }
      else if (err.code === 'InvalidParameterException') {
          AppLogger.error(correlation_id, `${method_name} - error:`, "You provided an invalid value for a parameter.");
      }
      else if (err.code === 'InvalidRequestException') {
          AppLogger.error(correlation_id, `${method_name} - error:`, "You provided a parameter value that is not valid for the current state of the resource.");
      }
      else if (err.code === 'ResourceNotFoundException') {
          AppLogger.error(correlation_id, `${method_name} - error:`, "We can't find the resource that you asked for.");
      } else {
        AppLogger.error(correlation_id, `${method_name} - failed to retrieve secret value. error:`, err);
      }
      return Promise.reject(ErrorCodes.ERROR_SECRETS_MANAGER_GET_SECRET_VALUE);
    }
  }
}