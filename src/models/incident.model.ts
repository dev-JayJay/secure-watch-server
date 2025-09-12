import knex from '../config/db/knex.js';
import { IncidentStatus } from "../schema/incident.schema.js";

export interface Incident {
    id?: number;
    title: string;
    type: string;
    location: string;
    longitude?: string;
    latitude?: string;
    description: string;
    status: IncidentStatus.PENDING | IncidentStatus.UNDER_REVIEW | IncidentStatus.VERIFIED | IncidentStatus.REJECTED | IncidentStatus.RESOLVED | IncidentStatus.ESCALATED | IncidentStatus.ARCHIVED;
    priority: 'low' | 'medium' | 'high' | 'critical';
    reported_by: number;
    assigned_to?: number;
    created_at?: Date;
    updated_at?: Date;
}

export class IncidentModel {
    private tableName = 'incidents';

    async createIncident(Incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>): Promise<Incident> {
        const [newIncidentId] = await knex(this.tableName).insert(Incident);
        const newIncident = await knex(this.tableName).where({ id: newIncidentId }).first();
        return newIncident;
    }

    async getIncidentById(id: number): Promise<Incident | undefined> {
        const incident = await knex(this.tableName).where({ id }).first();
        return incident;
    }

    async getAllIncidents(): Promise<Incident[]> {
        const incidents = await knex(this.tableName).select('*');
        return incidents;
    }

    async updateIncident(id: number, updates: Partial<Omit<Incident, 'id' | 'created_at' | 'updated_at'>>): Promise<Incident | undefined> {
        await knex(this.tableName).where({ id }).update(updates);
        const updatedIncident = await knex(this.tableName).where({ id }).first();
        return updatedIncident;
    }

    async deleteIncident(id: number): Promise<void> {
        await knex(this.tableName).where({ id }).del();
    }
}