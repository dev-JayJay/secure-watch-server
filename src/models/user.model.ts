import knex from '../config/db/knex.js';

export interface User {
    id?: number;
    fullname: string;
    email: string;
    password: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class UserModel {
    private tableName = 'users';

    async createUser(user: Omit<User, 'id' | 'role' | 'created_at' | 'updated_at'>): Promise<User> {
        const [newUserId] = await knex(this.tableName).insert(user);
        const newUser = await knex(this.tableName).where({ id: newUserId }).first();
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
        const users = await knex(this.tableName).select('*');
        return users;
    }
}