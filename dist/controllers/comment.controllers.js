import { StatusCodes } from "http-status-codes";
import { commentModel } from "../models/comment.model.js";
import { extractToken } from "../utils/jwt.js";
const commentModelInstance = new commentModel();
export class CommentController {
    // Create a new comment
    static async createComment(req, res) {
        try {
            const { comment, incident_id } = req.body;
            if (!comment || !incident_id) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Missing required fields",
                    status: "error",
                    data: null,
                });
            }
            const { id: userId } = extractToken(req.headers.authorization?.split(" ")[1] || "");
            const newComment = {
                comment,
                incident_id,
                user_id: userId,
            };
            const createdComment = await commentModelInstance.createComment(newComment);
            return res.status(StatusCodes.CREATED).json({
                message: "Comment created successfully",
                status: "success",
                data: createdComment,
            });
        }
        catch (error) {
            console.log("Error creating comment:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null,
            });
        }
    }
    // Get comments for a specific incident
    static async getCommentsByIncident(req, res) {
        try {
            const incidentId = parseInt(req.params.incidentId, 10);
            if (isNaN(incidentId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid incident ID",
                    status: "error",
                    data: null,
                });
            }
            const comments = await commentModelInstance.getPostComments(incidentId);
            return res.status(StatusCodes.OK).json({
                message: "Comments retrieved successfully",
                status: "success",
                data: comments,
            });
        }
        catch (error) {
            console.log("Error fetching comments:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null,
            });
        }
    }
    // Delete a comment by ID
    static async deleteComment(req, res) {
        try {
            const commentId = parseInt(req.params.id, 10);
            if (isNaN(commentId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid comment ID",
                    status: "error",
                    data: null,
                });
            }
            const existingComment = await commentModelInstance.getCommentById(commentId);
            if (!existingComment) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Comment not found",
                    status: "error",
                    data: null,
                });
            }
            await commentModelInstance.deleteComment(commentId);
            return res.status(StatusCodes.OK).json({
                message: "Comment deleted successfully",
                status: "success",
                data: null,
            });
        }
        catch (error) {
            console.log("Error deleting comment:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null,
            });
        }
    }
}
