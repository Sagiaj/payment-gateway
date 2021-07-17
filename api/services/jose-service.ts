import JoseProvider from "../providers/jose-provider";

export default class JoseService {
  static async encryptPayload(correlation_id: string, payload: string | object) {
    const method_name = "JoseService/encryptPayload";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const { encryption_algorithm, cipher_algorithm } = Globals.jose;
      const { encryption_key_id: key_id, message_level_encryption: { public_key: client_public_key } } = Globals.card_networks.visa.credentials;
      AppLogger.verbose(correlation_id, `${method_name} - calling JoseProvider/createEncryptedPayload`);
      const encryptedPayload = await JoseProvider.createEncryptedPayload(correlation_id, payloadString, key_id, encryption_algorithm, cipher_algorithm, client_public_key);
      return { encData: encryptedPayload };
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }

  static async decryptCiphertext(correlation_id: string, ciphertext: string) {
    const method_name = "JoseService/decryptCiphertext";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      let encryptedPayload = typeof ciphertext == 'string' ? JSON.parse(ciphertext) : ciphertext;
      const { encryption_algorithm, cipher_algorithm } = Globals.jose;
      const { encryption_key_id: key_id, message_level_encryption: { private_key: client_private_key } } = Globals.card_networks.visa.credentials;
      AppLogger.verbose(correlation_id, `${method_name} - calling JoseProvider/decryptEncryptedPayload`);
      const decrypted = await JoseProvider.decryptEncryptedPayload(correlation_id, encryptedPayload.encData, key_id, encryption_algorithm, cipher_algorithm, client_private_key);
      AppLogger.info(correlation_id, `${method_name} - end`);
      return decrypted;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
}
