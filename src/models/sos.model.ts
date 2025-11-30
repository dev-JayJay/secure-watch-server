import knex from '../config/db/knex.js';

export interface SOS {
  id?: number;
  user_id: number;
  message: string;
  latitude: number;
  city: string;
  longitude: number;
  created_at?: Date;
  updated_at?: Date;
}

export class SOSModel {
  private tableName = 'sos';

  // Create a new SOS record
  async createSOS(sos: Omit<SOS, 'id' | 'created_at' | 'updated_at'>): Promise<SOS> {
    const [newSOS] = await knex(this.tableName)
      .insert(sos)
      .returning('*'); // PostgreSQL returns the inserted row
    return newSOS;
  }

  async getSOSById(id: number): Promise<SOS | undefined> {
    return knex(this.tableName).where({ id }).first();
  }

  async getAllSOS(): Promise<SOS[]> {
    return knex(this.tableName).select('*');
  }

  async updateSOS(
    id: number,
    updates: Partial<Omit<SOS, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<SOS | undefined> {
    await knex(this.tableName).where({ id }).update(updates);
    return knex(this.tableName).where({ id }).first();
  }

  async deleteSOS(id: number): Promise<void> {
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
