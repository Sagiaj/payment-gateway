import express from 'express';
import { Router } from "express";
import { merchantRoutes } from "./merchants";
import { paymentRoutes } from "./payments";
import { webhookRoutes } from "./webhooks";

const router = Router();

router.use("/merchants", merchantRoutes);
router.use("/payments", paymentRoutes);
router.use("/wh", webhookRoutes);
router.use(express.static(`./front/`));

export default router;
