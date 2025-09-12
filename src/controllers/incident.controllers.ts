import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IncidentModel } from '../models/incident.model.js';
import { IncidentSchema } from '../schema/incident.schema.js';

const incidentModel = new IncidentModel();

export class IncidentController {
    static async createIncident(req: Request, res: Response) {
        try {
            const parseResult = IncidentSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: null
                });
            }
            
            const { title, type, location, longitude, latitude, description, status, priority, reported_by } = parseResult.data;

            const newIncident = await incidentModel.createIncident({ title, type, location, longitude, latitude, description, status, priority, reported_by });
            return res.status(StatusCodes.CREATED).json({
                message: 'Incident created successfully',
                status: 'success',
                data: newIncident
            });
        } catch (error) {

        }
    }
}