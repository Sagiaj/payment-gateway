import axios, { AxiosInstance } from "axios";
// import * as CryptoJS from "crypto";

// var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
// const pgw_request_timestamp = timestamp;

// var signature_salt = CryptoJS.lib.WordArray.random(12);
// const pgw_signature_salt = signature_salt;

// var body = '';
// if (request.data) {
//     body = JSON.stringify(JSON.parse(request.data));
//     body = body == "{}" ? "" : body;
// }

// var secret = pm.environment.get('pgw_secret_key');
// var to_sign = request.method.toLowerCase() + request.url.replace('{{base_url}}','') + signature_salt + timestamp + pm.environment.get('pgw_access_key') + secret + body;

// var pgw_signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret));
// pgw_signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pgw_signature));





export class BaseAPI {
  protected static _axios: AxiosInstance;

  addCommonHeaders(headers: { [key: string]: string; }) {
    BaseAPI._axios.interceptors.request.use((config) => {
      for (let header in headers) {
        config.headers[header] = headers[header];
      }
      return config;
    });
  }
}

export class ApiProvider extends BaseAPI {
  get axios() {
    if (!BaseAPI._axios) {
      const instance = axios.create({ /*baseURL: `${document.location.origin}`*/ baseURL: "http://localhost:3333", headers: {
        access_token: ""
      }});
      BaseAPI._axios = instance;
    }

    return BaseAPI._axios;
  }

  async getClientToken(provider_name: string) {
    return (await this.axios.get(`/merchants/${provider_name}/client-token`)).data;
  }

  async getProviderConfiguration(provider_name: string) {
    try {
      const data = await (await this.axios.get(`/merchants/${provider_name}/configuration`)).data;

      return data;
    } catch (err) {
      console.log("Failed getting provider configuration. Error=", err);
      return Promise.reject(err);
    }
  }

  async performProviderAction(provider_name: string, action_name: string, payload: any) {
    try {
      const data = await (await this.axios.post(`/merchants/${provider_name}/actions/${action_name}`, payload)).data;

      return data;
    } catch (err) {
      console.log("Failed performing provider action. Error=", err);
      return Promise.reject(err);
    }
  }
}

const apiProvider = new ApiProvider();

export default apiProvider;
