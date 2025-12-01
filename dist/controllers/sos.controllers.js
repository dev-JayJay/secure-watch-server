import { SOSModel } from "../models/sos.model.js";
import { StatusCodes } from "http-status-codes";
import { createSosSchema, updateSosSchema } from "../schema/sos.schema.js";
import { extractToken } from "../utils/jwt.js";
import { UserModel } from "../models/user.model.js";
import { getDistance } from "../utils/distance.js";
import { sendExpoNotifications } from "../utils/expoPush.js";
const sosModel = new SOSModel();
const userModel = new UserModel();
export class SOSController {
    static async createSOS(req, res) {
        try {
            const parseResult = createSosSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid input",
                    status: "error",
                    data: parseResult.error.flatten().fieldErrors
                });
            }
            const { message, longitude, latitude } = parseResult.data;
            const userId = extractToken(req.headers.authorization?.split(" ")[1] || "").id;
            const newSOS = await sosModel.createSOS({
                message,
                longitude,
                city: "",
                latitude,
                user_id: userId
            });
            // Fetch all users who have Expo push tokens
            const users = await userModel.getUsersWithLocationAndToken();
            const nearbyUsers = users.filter(u => {
                if (!u.latitude || !u.longitude || !u.fcm_token)
                    return false;
                const distance = getDistance(latitude, longitude, u.latitude, u.longitude);
                return distance <= 5; // km
            });
            // Notification payload for nearby users
            const payload = {
                notification: {
                    title: "🚨 SOS Alert Nearby",
                    body: message || "Someone nearby needs help!",
                },
                data: {
                    sosId: newSOS.id?.toString() ?? '',
                    latitude: latitude.toString(),
                    longitude: longitude.toString()
                }
            };
            const tokens = nearbyUsers.map(u => u.fcm_token).filter((t) => typeof t === "string");
            if (tokens.length > 0) {
                await sendExpoNotifications(tokens, payload);
            }
            // Notify SOS creator
            const creator = await userModel.getUserById(userId);
            if (creator?.fcm_token) {
                await sendExpoNotifications([creator.fcm_token], {
                    notification: {
                        title: "✔ SOS Sent",
                        body: "Your SOS alert was sent to nearby users"
                    },
                    data: { sosId: newSOS.id?.toString() ?? "" }
                });
            }
            return res.status(StatusCodes.CREATED).json({
                message: "SOS created and notifications sent",
                status: "success",
                data: newSOS
            });
        }
        catch (err) {
            console.log("SOS ERROR:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }
    static async getAllSOS(req, res) {
        try {
            const allSOS = await sosModel.getAllSOS();
            return res.status(StatusCodes.OK).json({
                message: "All SOS fetched successfully",
                status: "success",
                data: allSOS
            });
        }
        catch (error) {
            console.log("this is the error when fetching all sos", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }
    static async getSOSById(req, res) {
        try {
            const sosId = parseInt(req.params.id, 10);
            if (isNaN(sosId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid SOS ID",
                    status: "error",
                    data: null
                });
            }
            const sos = await sosModel.getSOSById(sosId);
            if (!sos) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "SOS not found",
                    status: "error",
                    data: null
                });
            }
            return res.status(StatusCodes.OK).json({
                message: "SOS fetched successfully",
                status: "success",
                data: sos
            });
        }
        catch (error) {
            console.log("this is the error i get when fetching an sos by id", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }
    static async updateSOS(req, res) {
        try {
            const sosId = parseInt(req.params.id, 10);
            if (isNaN(sosId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid SOS ID",
                    status: "error",
                    data: null
                });
            }
            const parseResult = updateSosSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid input",
                    status: "error",
                    data: parseResult.error.flatten().fieldErrors
                });
            }
            const sos = await sosModel.getSOSById(sosId);
            if (!sos) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "SOS not found",
                    status: "error",
                    data: null
                });
            }
            const updatedSOS = await sosModel.updateSOS(sosId, parseResult.data);
            return res.status(StatusCodes.OK).json({
                message: "SOS updated successfully",
                status: "success",
                data: updatedSOS
            });
        }
        catch (error) {
            console.log("this is the error i get when updating an sos by id", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }
    static async deleteSOS(req, res) {
        try {
            const sosId = parseInt(req.params.id, 10);
            if (isNaN(sosId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid SOS ID",
                    status: "error",
                    data: null
                });
            }
            const sos = await sosModel.getSOSById(sosId);
            if (!sos) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "SOS not found",
                    status: "error",
                    data: null
                });
            }
            await sosModel.deleteSOS(sosId);
            return res.status(StatusCodes.OK).json({
                message: "SOS deleted successfully",
                status: "success",
                data: null
            });
        }
        catch (error) {
            console.log("this is the error i get when deleting an sos by id", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }
}
