import { Router } from "express";
import { merchantRoutes } from "./merchants";

const router = Router();

router.use("/merchants", merchantRoutes);

export default router;
