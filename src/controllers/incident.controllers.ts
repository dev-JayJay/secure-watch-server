import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IncidentModel } from '../models/incident.model.js';
import { IncidentSchema } from '../schema/incident.schema.js';
import { extractToken } from '../utils/jwt.js';
import { stripQuotes } from '../utils/format-inputs.js';
import { mediaModel } from '../models/media.model.js';

const incidentModel = new IncidentModel();
const media = new mediaModel();

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

            const { title, type, location, longitude, latitude, description, status, priority, media_urls } = parseResult.data;

            const newIncident = await incidentModel.createIncident({ title, type, location, longitude, latitude, description, status, priority, severity: "",reported_by: userId });
            if (Array.isArray(media_urls) && media_urls.length > 0) {
                const incidentId = newIncident.id as number;
                for (const url of media_urls) {
                    await media.createMedia({
                        incident_id: incidentId,
                        media_url: url,
                        media_type: url.includes('video') ? 'video' : 'image'
                    });
                }
            }

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
        const latitude = stripQuotes(req.query.latitude as string | undefined);
        const longitude = stripQuotes(req.query.longitude as string | undefined);
        const location = stripQuotes(req.query.location as string | undefined);
        const type = stripQuotes(req.query.type as string | undefined);

        try {
            let incidents = [];
            if (latitude || longitude || location || type) {
                incidents = await incidentModel.getIncidentByLocation(longitude, latitude, location, type);
            } else {
                incidents = await incidentModel.getAllIncidents();
            }


            const incidentsWithMedia = await Promise.all(
                incidents.map(async (incident) => {
                    const mediaItems = await media.getMediaByIncidentId(incident.id as number);
                    return { ...incident, media: mediaItems };
                })
            );

            return res.status(StatusCodes.OK).json({
                message: 'Incidents retrieved successfully',
                status: 'success',
                data: incidentsWithMedia
            });
        } catch (error) {
            console.log('Error fetching incidents:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }


    static async getLatestIncidents(req: Request, res: Response) {
        try {

            const incidents = await incidentModel.latestIncidents();

            const incidentsWithMedia = await Promise.all(
                incidents.map(async (incident) => {
                    const mediaItems = await media.getMediaByIncidentId(incident.id as number);
                    return { ...incident, media: mediaItems };
                })
            );

            return res.status(StatusCodes.OK).json({
                message: 'Latest incidents retrieved successfully',
                status: 'success',
                data: incidentsWithMedia
            });
        } catch (error) {
            console.log('Error fetching latest incidents:', error);
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

            // Fetch media for the incident
            const mediaItems = await media.getMediaByIncidentId(incidentId);
            const incidentWithMedia = { ...incident, media: mediaItems };

            return res.status(StatusCodes.OK).json({
                message: 'Incident retrieved successfully',
                status: 'success',
                data: incidentWithMedia
            });

        } catch (error) {
            console.log('Error fetching incident by id:', error);
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