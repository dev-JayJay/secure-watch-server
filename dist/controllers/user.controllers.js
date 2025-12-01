import { extractToken } from "../utils/jwt.js";
import { UserModel } from "../models/user.model.js";
const userModel = new UserModel();
export class UserController {
    static async updateUserLocation(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1] || "";
            const userId = extractToken(token).id;
            const { latitude, longitude, fcm_token } = req.body;
            if (latitude == null || longitude == null) {
                return res.status(400).json({
                    status: "error",
                    message: "Latitude and longitude are required",
                });
            }
            // update lat/lng
            await userModel.updateLocation(userId, latitude, longitude);
            // update FCM token if provided
            if (fcm_token) {
                await userModel.updateFcmToken(userId, fcm_token);
            }
            return res.status(200).json({
                status: "success",
                message: "Location & token updated"
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                status: "error",
                message: "Failed to update location/token"
            });
        }
    }
}
