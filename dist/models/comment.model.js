import knex from '../config/db/knex.js';
export class commentModel {
    constructor() {
        this.tableName = "comments";
    }
    async createComment(Comment) {
        const [newCommentId] = await knex(this.tableName).insert(Comment);
        const comment = await knex(this.tableName).where({ id: newCommentId }).first();
        return comment;
    }
    async getPostComments(post_id) {
        const comments = await knex(this.tableName).where({ "id": post_id });
        return comments;
    }
    async getCommnetById(id) {
        const comment = await knex(this.tableName).where({ id }).first();
        return comment;
    }
    async deleteComment(id) {
        const comment = await knex(this.tableName).where({ id }).del();
    }
}
