import { Router } from "express";
import { SOSController } from "../controllers/sos.controllers.js";
const router = Router();
router.post('/', SOSController.createSOS);
router.get('/', SOSController.getAllSOS);
router.get('/:id', SOSController.getSOSById);
router.patch('/:id', SOSController.updateSOS);
router.delete('/:id', SOSController.deleteSOS);
export default router;
