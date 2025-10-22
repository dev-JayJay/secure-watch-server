export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.alterTable('users', (table) => {
    table.dropUnique('fullname');
  });
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.alterTable('users', (table) => {
    table.unique('fullname');
  });
}