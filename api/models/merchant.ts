export default class Merchant {
  id: string = "";
  name: string = "";
  access_key: string = "";
  secret_key: string = "";
  
  static parseFromDB(db_result: any): Merchant {
    const merchant = new Merchant();

    if (db_result) {
      merchant.id = db_result["merchant_id"] || "";
      merchant.access_key = db_result["merchant_access_key"] || "";
      merchant.secret_key = db_result["merchant_secret_key"] || "";
      merchant.name = db_result["merchant_name"] || "";
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
