import knex from '../config/db/knex.js';
export class IncidentModel {
    constructor() {
        this.tableName = 'incidents';
    }
    async createIncident(Incident) {
        const [newIncidentId] = await knex(this.tableName).insert(Incident);
        const newIncident = await knex(this.tableName).where({ id: newIncidentId }).first();
        return newIncident;
    }
    async getIncidentById(id) {
        const incident = await knex(this.tableName).where({ id }).first();
        return incident;
    }
    async getAllIncidents() {
        const incidents = await knex(this.tableName).select('*');
        return incidents;
    }
    async getIncidentByLocation(longitude, latitude, location) {
        const query = knex(this.tableName);
        if (longitude)
            query.where('longitude', longitude);
        if (latitude)
            query.where('latitude', latitude);
        if (location)
            query.where('location', location);
        const incidents = await query;
        return incidents;
    }
    async updateIncident(id, updates) {
        await knex(this.tableName).where({ id }).update(updates);
        const updatedIncident = await knex(this.tableName).where({ id }).first();
        return updatedIncident;
    }
    async deleteIncident(id) {
        await knex(this.tableName).where({ id }).del();
    }
}
