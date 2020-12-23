export default class Merchant {
  id: string = "";
  access_key: string = "";
  secret_key: string = "";
  
  static parseFromDB(db_result: any): Merchant {
    const merchant = new Merchant();

    if (db_result) {
      merchant.id = db_result["gateway_merchant_id"] || "";
      merchant.access_key = db_result["gateway_merchant_access_key"] || "";
      merchant.secret_key = db_result["gateway_merchant_secret_key"] || "";
    }
    return merchant;
  }

  static parseListFromDB(db_results: any[]): Merchant[] {
    const merchants = [];
    for (let result of db_results) {
      merchants.push(Merchant.parseFromDB(result));
    }
    return merchants;
  }
}
