export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.createTable("reactions", (table) => {
    table.increments("id").primary();
    table
      .integer("incident_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("incidents")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enum("type", ["like", "alert", "support", "seen", "sad"])
      .notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Make sure a user can react only once per type per incident
    table.unique(["incident_id", "user_id", "type"]);
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.dropTableIfExists("reactions");
}
