import { Router } from "express";
import WebhookController from "../controllers/webhook-controller";

const router = Router();

router.post("/:provider_name/process/:action_name", WebhookController.processGatewayAction);

router.post("/:provider_name/method-url-notification", WebhookController.process3DSVersion);

router.post("/:provider_name/3ds-complete", WebhookController.process3DSMethodComplete);

router.post("/:provider_name/acs-complete", WebhookController.process3DSACSChallengeComplete);

export const webhookRoutes = router;
