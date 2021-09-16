import CryptoProvider from "../providers/crypto-provider";

export default class CryptoService {
  static async verifySignature(correlation_id: string, to_sign_extended: string, signature: string, secret_key: string) {
    return CryptoProvider.verifyGatewaySignature(correlation_id, to_sign_extended, signature, secret_key);
  }
}
