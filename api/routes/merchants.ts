import { Router } from "express";
import MerchantsController from "../controllers/merchants-controller";

const router = Router();

router.post("/mti-message", MerchantsController.mtiMessage);

router.get("/:provider_name/client-token", MerchantsController.getClientToken);

router.get("/:provider_name/configuration", MerchantsController.getProviderConfiguration);

router.get("/:provider_name/actions/:action_name", MerchantsController.performProviderAction);

router.post("/:provider_name/actions/:action_name", MerchantsController.performProviderAction);

export const merchantRoutes = router;
