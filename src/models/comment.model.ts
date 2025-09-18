import { promises } from 'dns';
import knex from '../config/db/knex.js';


export interface Comment {
    id?: number;
    comment: string;
    user_id: number;
    incident_id: number
}

export class commentModel {
    private tableName = "comments";

    async createComment(Comment : Omit<Comment, 'id'>): Promise<Comment> {
        const [newCommentId] = await knex(this.tableName).insert(Comment);
        const comment = await knex(this.tableName).where({id: newCommentId}).first();
        return comment;

    }

    async getPostComments(post_id: number): Promise<Comment[]> {
        const comments = await knex(this.tableName).where({ "id": post_id });
        return comments;
    }

    async getCommnetById(id: number): Promise<Comment> {
        const comment = await knex(this.tableName).where({ id }).first();
        return comment;
    }

    async deleteComment(id: number): Promise<void> {
        const comment = await knex(this.tableName).where({ id }).del();
    }
}