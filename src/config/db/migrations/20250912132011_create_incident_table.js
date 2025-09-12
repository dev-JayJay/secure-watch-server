export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.createTable("incidents", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.text("severity").notNullable();
    table.text("location").notNullable();
    table.text("latitude").nullable();
    table.text("longitude").nullable();
    table.timestamp("reported_at").defaultTo(knex.fn.now());
    table.string("status").notNullable().defaultTo("open");
    table
      .integer("reported_by")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.dropTableIfExists("incidents");
}
