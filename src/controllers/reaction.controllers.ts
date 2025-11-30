import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ReactionModel } from "../models/reaction.model.js";
import { extractToken } from "../utils/jwt.js";

const reactionModel = new ReactionModel();

export class ReactionController {
    static async addReaction(req: Request, res: Response) {
        try {
            const { incident_id, type } = req.body;
            if (!incident_id || !type) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing fields" });
            }

            const { id: user_id } = extractToken(req.headers.authorization?.split(" ")[1] || "");
            const reaction = await reactionModel.addReaction({ user_id, incident_id, type });

            return res.status(StatusCodes.CREATED).json({ message: "Reaction added", data: reaction });
        } catch (err) {
            console.log("Error adding reaction:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    static async removeReaction(req: Request, res: Response) {
        try {
            const { incident_id, type } = req.body;
            const { id: user_id } = extractToken(req.headers.authorization?.split(" ")[1] || "");

            await reactionModel.removeReaction(user_id, incident_id, type);
            return res.status(StatusCodes.OK).json({ message: "Reaction removed" });
        } catch (err) {
            console.log("Error removing reaction:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    static async getReactions(req: Request, res: Response) {
        try {
            const incident_id = parseInt(req.params.incidentId, 10);
            const reactions = await reactionModel.getReactionsByIncident(incident_id);

            return res.status(StatusCodes.OK).json({ data: reactions });
        } catch (err) {
            console.log("Error fetching reactions:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
}
