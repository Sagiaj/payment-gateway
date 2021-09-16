import { IFinancialCardParser } from "./contracts/financial-card-parser";

export default class FinancialCardMessageHeader implements IFinancialCardParser {
  private _data: string = "";

  parse(text: string): string {
    
    return this._data;
  }
}
