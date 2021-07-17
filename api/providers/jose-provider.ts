import * as nodeJose from "node-jose";

export default class JoseProvider {
  static async createEncryptedPayload(correlation_id: string, payload: string, key_id: string, encryption_algorithm: string, cipher_algorithm: string, encryption_key: string) {
    const method_name = "JoseProvider/createEncryptedPayload";
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const keystore = nodeJose.JWK.createKeyStore();
      let key = await keystore.add(encryption_key, 'pem', {
        kid: key_id,
        alg: encryption_algorithm,
        enc: cipher_algorithm
      });
      const encrypted =
        await nodeJose.JWE
          .createEncrypt({ format: 'compact', fields: { enc: cipher_algorithm, iat: Date.now() } }, key)
          .update(payload)
          .final();
      AppLogger.info(correlation_id, `${method_name} - end`);
      return encrypted;
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }

  static async decryptEncryptedPayload(correlation_id: string, ciphertext: string, key_id: string, encryption_algorithm: string, cipher_algorithm: string, decryption_key: string): Promise<nodeJose.JWE.DecryptResult> {
    const method_name = "JoseProvider/decryptEncryptedPayload";
    AppLogger.info(correlation_id, `${method_name} - start`);
    AppLogger.info(correlation_id, `${method_name} - input params: ciphertext=${ciphertext}, key_id=${key_id}, encryption_algorithm=${encryption_algorithm}, cipher_algorithm=${cipher_algorithm}, decryption_key=${decryption_key}`);
    try {
      const keystore = nodeJose.JWK.createKeyStore();
      let key = await keystore.add(decryption_key, "pem", {
        kid: key_id,
        alg: encryption_algorithm,
        enc: cipher_algorithm
      });
      const decrypted = 
        await nodeJose.JWE
          .createDecrypt(key)
          .decrypt(ciphertext);

      return JSON.parse(String(decrypted.plaintext));
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return Promise.reject(err);
    }
  }
}
