import knex from "../config/db/knex.js";

export interface Media {
  id?: number;
  incident_id: number;
  media_url: string;
  media_type: "image" | "video";
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class mediaModel {
  private tableName = "incident_media";

  // Create a new media record and return it
  async createMedia(media: Omit<Media, "id">): Promise<Media> {
    const [savedMedia] = await knex(this.tableName)
      .insert(media)
      .returning("*"); // PostgreSQL returns the inserted row
    return savedMedia;
  }

  // Get all media for a specific incident, newest first
  async getIncidentMedia(incident_id: number): Promise<Media[]> {
    return knex(this.tableName)
      .where({ incident_id })
      .orderBy("created_at", "desc");
  }

  // Get media URLs and types for a specific incident
  async getMediaByIncidentId(incident_id: number) {
    return knex(this.tableName)
      .where({ incident_id })
      .select("media_url", "media_type");
  }

  // Get a single media record by ID
  async getMediaById(id: number): Promise<Media | undefined> {
    return knex(this.tableName).where({ id }).first();
  }

  // Delete a media record
  async deleteMedia(id: number): Promise<void> {
    await knex(this.tableName).where({ id }).del();
  }
}
