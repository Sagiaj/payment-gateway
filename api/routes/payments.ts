import { Router } from "express";
import PaymentsController from "../controllers/payments-controller";

const router = Router();

router.post("/card", PaymentsController.createCardPayment);

export const merchantRoutes = router;
