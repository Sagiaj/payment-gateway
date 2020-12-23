export default class MerchantsController {
  static async firstRoute(req, res, next) {
    const method_name = `MerchantsController/firstRoute`;
    const correlation_id = req["correlation_id"];
    AppLogger.info(correlation_id, `${method_name} - start`);
    try {
      const result = {};
      return res.send(result);
    } catch (err) {
      AppLogger.error(correlation_id, `${method_name} - error:`, err);
      return next(err);
    }
  }
}
