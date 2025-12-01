import knex from "../config/db/knex.js";
export class ReactionModel {
    constructor() {
        this.tableName = "reactions";
    }
    // Add a reaction and return the inserted row
    async addReaction(reaction) {
        const [newReaction] = await knex(this.tableName)
            .insert(reaction)
            .returning("*"); // PostgreSQL returns the inserted row
        return newReaction;
    }
    // Remove a specific reaction
    async removeReaction(user_id, incident_id, type) {
        await knex(this.tableName)
            .where({ user_id, incident_id, type })
            .del();
    }
    // Get reaction counts for a specific incident
    async getReactionsByIncident(incident_id) {
        return knex(this.tableName)
            .select("type")
            .count("* as count")
            .where({ incident_id })
            .groupBy("type");
    }
}
