import knex from '../config/db/knex.js';

export interface User {
  id?: number;
  fullname: string;
  email: string;
  password: string;
  role?: string;
  latitude?: number;
  longitude?: number;
  fcm_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  private tableName = 'users';

  // Create a new user and return the inserted row
  async createUser(user: Omit<User, 'id' | 'role' | 'created_at' | 'updated_at'>): Promise<User> {
    const [newUser] = await knex(this.tableName)
      .insert(user)
      .returning('*'); // Postgres: returns the inserted row(s)
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await knex(this.tableName).where({ email }).first();
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user = await knex(this.tableName).where({ id }).first();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return knex(this.tableName).select('*');
  }

  async updateLocation(userId: number, latitude: number, longitude: number): Promise<void> {
    await knex(this.tableName)
      .where({ id: userId })
      .update({ latitude, longitude });
  }

  async updateFcmToken(userId: number, fcm_token: string): Promise<void> {
    await knex(this.tableName)
      .where({ id: userId })
      .update({ fcm_token });
  }

  async getUsersWithLocationAndToken(): Promise<User[]> {
    return knex(this.tableName)
      .whereNotNull('latitude')
      .whereNotNull('longitude')
      .whereNotNull('fcm_token');
  }
}
