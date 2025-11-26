import knex from '../config/db/knex.js';
export class SOSModel {
    constructor() {
        this.tableName = 'sos';
    }
    async createSOS(sos) {
        const [newSOSId] = await knex(this.tableName).insert(sos);
        const newSOS = await knex(this.tableName).where({ id: newSOSId }).first();
        return newSOS;
    }
    async getSOSById(id) {
        const sos = await knex(this.tableName).where({ id }).first();
        return sos;
    }
    async getAllSOS() {
        const sosList = await knex(this.tableName).select('*');
        return sosList;
    }
    async updateSOS(id, updates) {
        await knex(this.tableName).where({ id }).update(updates);
        const updatedSOS = await knex(this.tableName).where({ id }).first();
        return updatedSOS;
    }
    async deleteSOS(id) {
        await knex(this.tableName).where({ id }).del();
    }
}
