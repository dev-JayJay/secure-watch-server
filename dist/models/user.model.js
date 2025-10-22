import knex from '../config/db/knex.js';
export class UserModel {
    constructor() {
        this.tableName = 'users';
    }
    async createUser(user) {
        const [newUserId] = await knex(this.tableName).insert(user);
        const newUser = await knex(this.tableName).where({ id: newUserId }).first();
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
        const users = await knex(this.tableName).select('*');
        return users;
    }
}
