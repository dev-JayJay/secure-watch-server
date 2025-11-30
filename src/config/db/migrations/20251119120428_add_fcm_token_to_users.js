export async function up(knex) {
  // TODO: Write migration logic here
    return knex.schema.alterTable("users", (table) => {
    table.string("fcm_token").nullable().comment("Firebase Cloud Messaging token for push notifications");
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
    return knex.schema.alterTable("users", (table) => {
    table.dropColumn("fcm_token");
  });
}