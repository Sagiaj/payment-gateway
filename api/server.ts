import express from 'express';
import { middleware } from "./middleware";
import routes from "./routes";
import { bootstrapApplication } from "./config";

const expressApp = express();

bootstrapApplication(expressApp).then(readyApp => {
  expressApp.use(middleware, routes);
  readyApp.listen(initConfig.SERVER_PORT, () => {
    AppLogger.silly(`Server is listening on port ${initConfig.SERVER_PORT}`);
  })
});
