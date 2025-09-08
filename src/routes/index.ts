import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health-check", healthRoutes);

export default router;
