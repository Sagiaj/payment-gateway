import { Router } from "express";
import PaymentsController from "../controllers/payments-controller";

const router = Router();

router.post("/card/:card_network_type", PaymentsController.createCardPayment);
router.post("/card/authorize/:card_network_type", PaymentsController.authorizeCardTransaction);

export const paymentRoutes = router;
