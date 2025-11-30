import { Router } from "express";
import { IncidentController } from "../controllers/incident.controllers.js";

const router = Router();

router.post('/', IncidentController.createIncident);
router.get('/latest', IncidentController.getLatestIncidents);
router.get('/', IncidentController.getAllIncidents);
router.get('/:id', IncidentController.getIncidentById);
router.patch('/:id', IncidentController.updateIncident);
router.delete('/:id', IncidentController.deleteIncident);

export default router;