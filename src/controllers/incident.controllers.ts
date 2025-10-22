import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IncidentModel } from '../models/incident.model.js';
import { IncidentSchema } from '../schema/incident.schema.js';
import { extractToken } from '../utils/jwt.js';
import { stripQuotes } from '../utils/format-inputs.js';

const incidentModel = new IncidentModel();

export class IncidentController {
    static async createIncident(req: Request, res: Response) {
        try {

            const parseResult = IncidentSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: parseResult.error.flatten().fieldErrors
                });
            }

            const { id: userId } = extractToken(req.headers.authorization?.split(' ')[1] || '');

            const { title, type, location, longitude, latitude, description, status, priority, reported_by } = parseResult.data;

            const newIncident = await incidentModel.createIncident({ title, type, location, longitude, latitude, description, status, priority, reported_by: userId });
            return res.status(StatusCodes.CREATED).json({
                message: 'Incident created successfully',
                status: 'success',
                data: newIncident
            });
        } catch (error) {
            console.log('this is the error from the server creating an incident', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }

    static async getAllIncidents(req: Request, res: Response) {
        const latitude = stripQuotes(req.query.latitude as string | undefined) ;
        const longitude = stripQuotes(req.query.longitude as string | undefined) ;
        const location = stripQuotes(req.query.location as string | undefined);

        try {
            if (latitude || longitude || location) {
                
                const incidents = await incidentModel.getIncidentByLocation(longitude, latitude, location);
                return res.status(StatusCodes.OK).json({
                    message: 'Incidents retrieved successfully',
                    status: 'success',
                    data: incidents
                });
                
            }

            const incidents = await incidentModel.getAllIncidents();
            return res.status(StatusCodes.OK).json({
                message: 'Incidents retrieved successfully',
                status: 'success',
                data: incidents
            });
        } catch (error) {
            console.log('this is the error from the server getting all incidents', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }

    static async getIncidentById(req: Request, res: Response) {
        try {
            const incidentId = parseInt(req.params.id, 10);
            if (isNaN(incidentId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid incident ID',
                    status: 'error',
                    data: null
                });
            }

            const incident = await incidentModel.getIncidentById(incidentId);
            if (!incident) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Incident not found',
                    status: 'error',
                    data: null
                });
            }

            return res.status(StatusCodes.OK).json({
                message: 'Incident retrieved successfully',
                status: 'success',
                data: incident
            });

        } catch (error) {
            console.log('this is the error from the server getting an incident by id', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }

    static async updateIncident(req: Request, res: Response) {
        try {
            const incidentId = parseInt(req.params.id, 10);
            if (isNaN(incidentId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid incident ID',
                    status: 'error',
                    data: null
                });
            }

            const parseResult = IncidentSchema.partial().safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: parseResult.error.flatten().fieldErrors
                });
            }

            const incident = await incidentModel.getIncidentById(incidentId);
            if (!incident) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Incident not found',
                    status: 'error',
                    data: null
                });
            }

            const updates = parseResult.data;
            const updatedIncident = await incidentModel.updateIncident(incidentId, updates);
            return res.status(StatusCodes.OK).json({
                message: 'Incident updated successfully',
                status: 'success',
                data: updatedIncident
            });

        } catch (error) {
            console.log('this is the error from the server updating an incident', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }

    static async deleteIncident(req: Request, res: Response) {
        try {
            const incidentId = parseInt(req.params.id, 10);
            if (isNaN(incidentId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid incident ID',
                    status: 'error',
                    data: null
                });
            }

            const incident = await incidentModel.getIncidentById(incidentId);
            if (!incident) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Incident not found',
                    status: 'error',
                    data: null
                });
            }
            await incidentModel.deleteIncident(incidentId);
            return res.status(StatusCodes.OK).json({
                message: 'Incident deleted successfully',
                status: 'success',
                data: null
            });

        } catch (error) {
            console.log('this is the error from the server deleting an incident', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }
}