import { Router } from "express";
import MerchantsController from "../controllers/merchants-controller";

const router = Router();

router.post("/first-route", MerchantsController.firstRoute);

export const merchantRoutes = router;
