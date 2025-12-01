import knex from '../config/db/knex.js';
export class SOSModel {
    constructor() {
        this.tableName = 'sos';
    }
    // Create a new SOS record
    async createSOS(sos) {
        const [newSOS] = await knex(this.tableName)
            .insert(sos)
            .returning('*'); // PostgreSQL returns the inserted row
        return newSOS;
    }
    async getSOSById(id) {
        return knex(this.tableName).where({ id }).first();
    }
    async getAllSOS() {
        return knex(this.tableName).select('*');
    }
    async updateSOS(id, updates) {
        await knex(this.tableName).where({ id }).update(updates);
        return knex(this.tableName).where({ id }).first();
    }
    async deleteSOS(id) {
        await knex(this.tableName).where({ id }).del();
    }
    // Returns users who have location and FCM token
    async getUsersWithLocationAndToken() {
        return knex('users')
            .whereNotNull('latitude')
            .whereNotNull('longitude')
            .whereNotNull('fcm_token');
    }
}
