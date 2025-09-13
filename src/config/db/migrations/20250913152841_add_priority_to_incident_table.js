export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.table('incidents', (table) => {
    table.string('priority').defaultTo('medium');
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.table('incidents', (table) => {
    table.dropColumn('priority');
  });
}