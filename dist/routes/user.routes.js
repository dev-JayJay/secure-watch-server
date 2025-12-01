import { Router } from "express";
import { UserController } from "../controllers/user.controllers.js";
const router = Router();
router.patch("/update-location", UserController.updateUserLocation);
export default router;
