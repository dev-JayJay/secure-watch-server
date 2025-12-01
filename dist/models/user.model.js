import knex from '../config/db/knex.js';
export class UserModel {
    constructor() {
        this.tableName = 'users';
    }
    // Create a new user and return the inserted row
    async createUser(user) {
        const [newUser] = await knex(this.tableName)
            .insert(user)
            .returning('*'); // Postgres: returns the inserted row(s)
        return newUser;
    }
    async getUserByEmail(email) {
        const user = await knex(this.tableName).where({ email }).first();
        return user;
    }
    async getUserById(id) {
        const user = await knex(this.tableName).where({ id }).first();
        return user;
    }
    async getAllUsers() {
        return knex(this.tableName).select('*');
    }
    async updateLocation(userId, latitude, longitude) {
        await knex(this.tableName)
            .where({ id: userId })
            .update({ latitude, longitude });
    }
    async updateFcmToken(userId, fcm_token) {
        await knex(this.tableName)
            .where({ id: userId })
            .update({ fcm_token });
    }
    async getUsersWithLocationAndToken() {
        return knex(this.tableName)
            .whereNotNull('latitude')
            .whereNotNull('longitude')
            .whereNotNull('fcm_token');
    }
}
