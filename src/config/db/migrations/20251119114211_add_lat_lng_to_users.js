export async function up(knex) {
  // TODO: Write migration logic here
    return knex.schema.alterTable("users", (table) => {
    table.decimal("latitude", 10, 7).nullable().comment("User's current latitude");
    table.decimal("longitude", 10, 7).nullable().comment("User's current longitude");
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
    return knex.schema.alterTable("users", (table) => {
    table.dropColumn("latitude");
    table.dropColumn("longitude");
  });
}