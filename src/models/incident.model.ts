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
   severity: string;
  reported_by: number;
  assigned_to?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class IncidentModel {
  private tableName = 'incidents';

  // Create a new incident and return it
  async createIncident(incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>): Promise<Incident> {
    const [newIncident] = await knex(this.tableName)
      .insert(incident)
      .returning('*'); // PostgreSQL returns the inserted row
    return newIncident;
  }

  async getIncidentById(id: number): Promise<Incident | undefined> {
    return knex(this.tableName).where({ id }).first();
  }

  async getAllIncidents(): Promise<Incident[]> {
    return knex(this.tableName)
      .select('*')
      .orderBy('reported_at', 'desc');
  }

  async latestIncidents(): Promise<Incident[]> {
    return knex(this.tableName)
      .select('*')
      .orderBy('reported_at', 'desc')
      .limit(5);
  }

  async getIncidentByLocation(
    longitude?: string,
    latitude?: string,
    location?: string,
    type?: string
  ): Promise<Incident[]> {
    const query = knex(this.tableName);
    if (longitude) query.where('longitude', longitude);
    if (latitude) query.where('latitude', latitude);
    if (location) query.where('location', location);
    if (type) query.where('type', type);
    return query;
  }

  async updateIncident(
    id: number,
    updates: Partial<Omit<Incident, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Incident | undefined> {
    await knex(this.tableName).where({ id }).update(updates);
    return knex(this.tableName).where({ id }).first();
  }

  async deleteIncident(id: number): Promise<void> {
    await knex(this.tableName).where({ id }).del();
  }
}
