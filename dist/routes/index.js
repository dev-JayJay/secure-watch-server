import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import incidentRoutes from "./incident.routes.js";
import sosRoutes from "./sos.routes.js";
import userRoutes from "./user.routes.js";
import commentsRoutes from "./comment.routes.js";
import reactionRoutes from "./reaction.routes.js";
import { authenticateToken } from "../middleware/jwt.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/health-check", healthRoutes);
// add authorization middleware to protect the sos routes after testing
router.use("/sos", authenticateToken, sosRoutes);
router.use("/user", authenticateToken, userRoutes);
router.use("/comment", authenticateToken, commentsRoutes);
router.use("/reaction", authenticateToken, reactionRoutes);
router.use("/incidents", incidentRoutes);
export default router;
