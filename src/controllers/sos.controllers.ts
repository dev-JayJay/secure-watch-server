import { Request, Response } from "express";
import { SOSModel } from "../models/sos.model.js";
import { StatusCodes } from "http-status-codes";
import { createSosSchema, updateSosSchema } from "../schema/sos.schema.js";
import { extractToken } from "utils/jwt.js";



const sosModel = new SOSModel();

export class SOSController {

    static async createSOS(req: Request, res: Response) {
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
                latitude,
                user_id: userId
            });
            return res.status(StatusCodes.CREATED).json({
                message: "SOS created successfully",
                status: "success",
                data: newSOS
            });

        } catch (error) {
            console.log("this is the error when creating sos", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }

    static async getAllSOS(req: Request, res: Response) {
        try {
            const allSOS = await sosModel.getAllSOS();
            return res.status(StatusCodes.OK).json({
                message: "All SOS fetched successfully",
                status: "success",
                data: allSOS
            });
        } catch (error) {
            console.log("this is the error when fetching all sos", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }

    static async getSOSById(req: Request, res: Response) {
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

        } catch (error) {
            console.log("this is the error i get when fetching an sos by id", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }

    static async updateSOS(req: Request, res: Response) {
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

        } catch (error) {
            console.log("this is the error i get when updating an sos by id", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }

    static async deleteSOS(req: Request, res: Response) {
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

        } catch (error) {
            console.log("this is the error i get when deleting an sos by id", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                status: "error",
                data: null
            });
        }
    }
}