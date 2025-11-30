import knex from '../config/db/knex.js';

export interface Comment {
  id?: number;
  comment: string;
  user_id: number;
  incident_id: number;
}

export class commentModel {
  private tableName = "comments";

  // Create a new comment and return the inserted row
  async createComment(commentData: Omit<Comment, 'id'>): Promise<Comment> {
    const [comment] = await knex(this.tableName)
      .insert(commentData)
      .returning('*'); // PostgreSQL returns the inserted row
    return comment;
  }

  // Get all comments for a specific incident, joined with user info
  async getPostComments(incident_id: number): Promise<any[]> {
    return knex(this.tableName)
      .join("users", "comments.user_id", "users.id")
      .select(
        "comments.id",
        "comments.comment",
        "comments.incident_id",
        "comments.user_id",
        "users.fullname as username",
        "comments.created_at"
      )
      .where({ incident_id })
      .orderBy("comments.created_at", "desc");
  }

  // Get a single comment by ID
  async getCommentById(id: number): Promise<Comment | undefined> {
    return knex(this.tableName).where({ id }).first();
  }

  // Delete a comment
  async deleteComment(id: number): Promise<void> {
    await knex(this.tableName).where({ id }).del();
  }
}
