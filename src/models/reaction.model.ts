import knex from "../config/db/knex.js";

export interface Reaction {
  id?: number;
  user_id: number;
  incident_id: number;
  type: "like" | "alert" | "support" | "seen" | "sad";
  created_at?: Date;
}

export class ReactionModel {
  private tableName = "reactions";

  // Add a reaction and return the inserted row
  async addReaction(reaction: Omit<Reaction, "id">): Promise<Reaction> {
    const [newReaction] = await knex(this.tableName)
      .insert(reaction)
      .returning("*"); // PostgreSQL returns the inserted row
    return newReaction;
  }

  // Remove a specific reaction
  async removeReaction(
    user_id: number,
    incident_id: number,
    type: string
  ): Promise<void> {
    await knex(this.tableName)
      .where({ user_id, incident_id, type })
      .del();
  }

  // Get reaction counts for a specific incident
  async getReactionsByIncident(incident_id: number): Promise<{ type: string; count: number }[]> {
    return knex(this.tableName)
      .select("type")
      .count("* as count")
      .where({ incident_id })
      .groupBy("type");
  }
}
