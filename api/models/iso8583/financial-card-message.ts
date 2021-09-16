import FinancialCardMessageBitmap from "./financial-card-message-bitmap";
import FinancialCardMessageDataElement from "./financial-card-message-data-element";
import FinancialCardMessageHeader from "./financial-card-message-header";
import FinancialCardMessageMTI from "./financial-card-message-mti";
import FinancialCardMessageTrailer from "./financial-card-message-trailer";

export class FinancialCardMessage {
  private _header: FinancialCardMessageHeader = new FinancialCardMessageHeader();
  private _mti: FinancialCardMessageMTI = new FinancialCardMessageMTI();
  private _bitmap: FinancialCardMessageBitmap = new FinancialCardMessageBitmap();
  private _data_elements: FinancialCardMessageDataElement[];
  private _trailer: FinancialCardMessageTrailer = new FinancialCardMessageTrailer();

  setHeader(header: string) {
    this._header.parse(header);
  }

  setMTI(mti: string) {
    this._mti.parse(mti);
  }

  setBitmap(bitmap: string) {
    this._bitmap.parse(bitmap);
  }

  setDataElements(data_elements: string) {
    const elements = data_elements.split("\n");
    for (let i = 0; i < elements.length; i++) {
      const dataElement = new FinancialCardMessageDataElement();
      dataElement.parse(elements[i]);
    }
  }

  setTrailer(trailer: string) {
    this._trailer.parse(trailer);
  }


  get header() {
    return this._header;
  }
  
  get mti() {
    return this._mti;
  }
  
  get bitmap() {
    return this._bitmap;
  }
  
  get data_elements() {
    return this._data_elements;
  }
  
  get trailer() {
    return this._trailer;
  }
}
