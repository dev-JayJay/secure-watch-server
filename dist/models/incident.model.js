import knex from '../config/db/knex.js';
export class IncidentModel {
    constructor() {
        this.tableName = 'incidents';
    }
    // Create a new incident and return it
    async createIncident(incident) {
        const [newIncident] = await knex(this.tableName)
            .insert(incident)
            .returning('*'); // PostgreSQL returns the inserted row
        return newIncident;
    }
    async getIncidentById(id) {
        return knex(this.tableName).where({ id }).first();
    }
    async getAllIncidents() {
        return knex(this.tableName)
            .select('*')
            .orderBy('reported_at', 'desc');
    }
    async latestIncidents() {
        return knex(this.tableName)
            .select('*')
            .orderBy('reported_at', 'desc')
            .limit(5);
    }
    async getIncidentByLocation(longitude, latitude, location, type) {
        const query = knex(this.tableName);
        if (longitude)
            query.where('longitude', longitude);
        if (latitude)
            query.where('latitude', latitude);
        if (location)
            query.where('location', location);
        if (type)
            query.where('type', type);
        return query;
    }
    async updateIncident(id, updates) {
        await knex(this.tableName).where({ id }).update(updates);
        return knex(this.tableName).where({ id }).first();
    }
    async deleteIncident(id) {
        await knex(this.tableName).where({ id }).del();
    }
}
