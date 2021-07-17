import { IFinancialCardParser } from "./contracts/financial-card-parser";

export default class FinancialCardMessageTrailer implements IFinancialCardParser {
  parse(text: string): string {
    throw new Error("Method not implemented.");
  }
  
}
