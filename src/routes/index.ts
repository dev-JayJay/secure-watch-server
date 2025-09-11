import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health-check", healthRoutes);

export default router;
