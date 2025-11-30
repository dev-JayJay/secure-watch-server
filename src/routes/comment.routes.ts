import { Router } from "express";
import { CommentController } from "../controllers/comment.controllers.js";

const router = Router();

router.post("/", CommentController.createComment);
router.get("/:incidentId", CommentController.getCommentsByIncident);
router.delete("/:id", CommentController.deleteComment);

export default router;
