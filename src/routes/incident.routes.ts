import { Router } from "express";
import { IncidentController } from "../controllers/incident.controllers.js";

const router = Router();

router.post('/', IncidentController.createIncident);

export default router;