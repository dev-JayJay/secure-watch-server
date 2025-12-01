import knex from "../config/db/knex.js";
export class mediaModel {
    constructor() {
        this.tableName = "incident_media";
    }
    // Create a new media record and return it
    async createMedia(media) {
        const [savedMedia] = await knex(this.tableName)
            .insert(media)
            .returning("*"); // PostgreSQL returns the inserted row
        return savedMedia;
    }
    // Get all media for a specific incident, newest first
    async getIncidentMedia(incident_id) {
        return knex(this.tableName)
            .where({ incident_id })
            .orderBy("created_at", "desc");
    }
    // Get media URLs and types for a specific incident
    async getMediaByIncidentId(incident_id) {
        return knex(this.tableName)
            .where({ incident_id })
            .select("media_url", "media_type");
    }
    // Get a single media record by ID
    async getMediaById(id) {
        return knex(this.tableName).where({ id }).first();
    }
    // Delete a media record
    async deleteMedia(id) {
        await knex(this.tableName).where({ id }).del();
    }
}
