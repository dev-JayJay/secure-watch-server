import knex from '../config/db/knex.js';

export interface SOS {
    id?: number;
    user_id: number;
    message: string;
    latitude: number;
    longitude: number;
    created_at?: Date;
    updated_at?: Date;
}

export class SOSModel {
    private tableName = 'sos';

    async createSOS(sos: Omit<SOS, 'id' | 'created_at' | 'updated_at'>): Promise<SOS> {
        const [newSOSId] = await knex(this.tableName).insert(sos);
        const newSOS = await knex(this.tableName).where({ id: newSOSId }).first();
        return newSOS;
    }

    async getSOSById(id: number): Promise<SOS | undefined> {
        const sos = await knex(this.tableName).where({ id }).first();
        return sos;
    }

    async getAllSOS(): Promise<SOS[]> {
        const sosList = await knex(this.tableName).select('*');
        return sosList;
    }

    async updateSOS(id: number, updates: Partial<Omit<SOS, 'id' | 'created_at' | 'updated_at'>>): Promise<SOS | undefined> {
        await knex(this.tableName).where({id}).update(updates);
        const updatedSOS = await knex(this.tableName).where({ id }).first();
        return updatedSOS;
    }

    async deleteSOS(id: number): Promise<void> {
        await knex(this.tableName).where({ id }).del();
    }
}