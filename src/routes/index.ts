import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import incidentRoutes from "./incident.routes.js";
import { authenticateToken } from "../middleware/jwt.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health-check", healthRoutes);
router.use("/incidents", authenticateToken, incidentRoutes);

export default router;
