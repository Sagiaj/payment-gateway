import crypto from "crypto";

export default class CryptoProvider {

  static hashWithHMAC(correlation_id: string, signed_input: string, secret_key: string): string {
    const method_name = `CryptoProvider/hashWithHMAC`;
    AppLogger.verbose(correlation_id, `${method_name} - start`);
    const hash = crypto.createHmac(Globals.crypto.hash_algorithm, secret_key);
    hash.update(signed_input);

    AppLogger.verbose(correlation_id, `${method_name}  - end`);
    return Buffer.from(hash.digest("hex")).toString(<BufferEncoding>Globals.crypto.hash_encoding);
  }

  static async verifyGatewaySignature(correlation_id: string, to_sign_extended: string, signature: string, secret_key: string): Promise<boolean> {
    const method_name = `CryptoProvider/verifyGatewaySignature`;
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const rehashedSignature = CryptoProvider.hashWithHMAC(correlation_id, to_sign_extended, secret_key);
      if (rehashedSignature == signature) {
        AppLogger.verbose(correlation_id, `${method_name} - success.`);
        return true;
      } else {
        AppLogger.error(correlation_id, `${method_name} - failed.`);
        return false;
      }
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - failed to verify gateway signature. error:`, err);
      return false;
    }
  }
}
