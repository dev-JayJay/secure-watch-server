export async function up(knex) {
  // TODO: Write migration logic here
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('fullname').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo('user');
    table.timestamps(true, true);
  })
}

export async function down(knex) {
  // TODO: Write rollback logic here
  return knex.schema.dropTableIfExists('users'); 
}