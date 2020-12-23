import express from 'express';
import { middleware } from "./middleware";
import routes from "./routes";
import { bootstrapApplication } from "./config"

const expressApp = express();
expressApp.use(middleware, routes);

bootstrapApplication(expressApp).then(readyApp => {
  readyApp.listen(Globals.SERVER_PORT, () => {
    AppLogger.silly(`Server is listening on port ${Globals.SERVER_PORT}`);
  })
});
