export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.createTable("comments", (table) => {
    table.increments("id").primary();
    table.text("comment").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .integer("incident_id")
      .unsigned()
      .references("id")
      .inTable("incidents")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.dropTableIfExists("comments");
}
