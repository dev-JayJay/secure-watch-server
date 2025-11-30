export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.createTable("incident_media", (table) => {
    table.increments("id").primary();

    table
      .integer("incident_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("incidents")
      .onDelete("CASCADE");
    table
      .enu("media_type", ["image", "video"], {
        useNative: true,
        enumName: "media_type_enum",
      })
      .notNullable();
    table.string("media_url").notNullable();
    table.string("description").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.dropTableIfExists("incident_media");
}
