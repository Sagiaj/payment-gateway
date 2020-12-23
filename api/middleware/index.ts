import { Router } from "express";
import { isAuthorized3rdParty } from "./is-authorized-3rd-party";
import { appErrorHandler } from "../utilities/gateway-error-utilities";
import { requestLogger } from "./request-logger";
import { opId } from "./operation-id";
const router = Router();

router.use(opId, requestLogger, isAuthorized3rdParty);
router.use(appErrorHandler);

export const middleware = router;
