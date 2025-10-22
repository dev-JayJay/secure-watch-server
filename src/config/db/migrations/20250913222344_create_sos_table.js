import { table } from "console";

export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.createTable("sos", (table) => {
    table.increments("id").primary();
    table.text("city").notNullable();
    table.text("latitude").notNullable();
    table.text("longitude").notNullable();
    table.string("message").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
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
  return knex.schema.dropTableIfExists("sos");
}
