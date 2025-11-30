import { Router } from "express";
import { ReactionController } from "../controllers/reaction.controllers.js";

const router = Router();

router.post("/", ReactionController.addReaction);
router.delete("/", ReactionController.removeReaction);
router.get("/:incidentId", ReactionController.getReactions);

export default router;
