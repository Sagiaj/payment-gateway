import { dimensionsFromChallengeWindowSize, IChallengeWindowOptions, IIframeData, IMessageEventData } from "globalpayments-3ds";

export default class ThreeDSHtmlUtilities {

  static randomId = Math.random().toString(16).substr(2, 8);
  static get iFrameRandomId() { return `threedsecure-iframe-${this.randomId}`; }

  static ensureIframeClosed(timeout: number) {
    if (timeout) {
      clearTimeout(timeout);
    }
  
    try {
      Array.prototype.slice.call(document
          .querySelectorAll(`[target$="-${this.randomId}"],[id$="-${this.randomId}"]`))
        .forEach((element) => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
    } catch (e) {
      console.log("errored closing iframe", e);
    }
  }

  static createIframe(name: string, id: string): HTMLFrameElement {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("name", name);
    iframe.id = id;
    iframe.style.display = "inherit";

    return <any>iframe;
  }

  static createHiddenForm(method: "POST" | "GET", action: string, target: string, inputAttributes: { type: string, name: string, value: string }[]) {
    const form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", action);
    form.setAttribute("target", target);
    
    for (let attribute of inputAttributes) {
      const threeDSMethodDataInput = document.createElement("input");
      threeDSMethodDataInput.setAttribute("type", attribute.type);
      threeDSMethodDataInput.setAttribute("name", attribute.name);
      threeDSMethodDataInput.setAttribute("value", attribute.value);
      form.appendChild(threeDSMethodDataInput);
    }
    return form;
  }

  static async postToIframe(endpoint: string, fields: any, options: IChallengeWindowOptions & { zIndex: number }, iframe?: HTMLFrameElement): Promise<IMessageEventData> {
    return new Promise((resolve, reject) => {
      let timeout: any;
      if (options.timeout) {
        timeout = setTimeout(() => {
          this.ensureIframeClosed(timeout);
          reject(new Error("timeout reached"));
        }, options.timeout);
      }

      window.addEventListener(
        "message",
        this.getWindowMessageEventHandler(resolve, reject, { timeout, origin: options.origin }),
        true
      );

      if (!iframe) {
        iframe = this.createIframe(this.iFrameRandomId, this.iFrameRandomId);
        iframe.style.display = options.hide ? "none" : "inherit";
        iframe.style.zIndex = String(options.zIndex || 0);
      }

      const form = this.createHiddenForm("POST", endpoint, iframe.id, fields);

      this.handleEmbeddedIframe(reject, { iframe, timeout }, options);

      document.body.appendChild(form);
      form.submit();
    });
  }

  static handleEmbeddedIframe(
    reject: (reason: any) => void,
    data: IIframeData,
    options: IChallengeWindowOptions,
  ) {
    let targetElement: Element | null | undefined;
  
    targetElement = options.target && typeof options.target === "string" ? document.querySelector(options.target) : document.body;
  
    if (!targetElement) {
      this.ensureIframeClosed(data.timeout || 0);
      reject(new Error("Embed target not found"));
      return false;
    }
  
    const { height, width } = dimensionsFromChallengeWindowSize(options);
  
    if (data.iframe) {
      data.iframe.setAttribute("height", height ? `${height}px` : "100%");
      data.iframe.setAttribute("width", width ? `${width}px` : "100%");
      targetElement.appendChild(data.iframe);
    }
  
    return true;
  }

  static getWindowMessageEventHandler(
    resolve: (
      data: IMessageEventData | PromiseLike<IMessageEventData>,
    ) => void,
    reject: any,
    data: IIframeData,
  ) {
    return (e: MessageEvent) => {
      const origin = data.origin || window.location.origin;
  
      if (origin !== e.origin) {
        return reject(`Origin '${origin}' does not match event's origin '${e.origin}'`);
      }
  
      this.ensureIframeClosed(data.timeout || 0);
      resolve(e.data);
    };
  }
}