/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('fitness_info', function(table) {
        table.increments('id').primary();
        table.integer('student_id').unsigned().notNullable();
        table.foreign('student_id').references('students.id');
        table.string('physical_activity').notNullable();
        table.integer('exercise_duration').notNullable();
        table.integer('anxiety_control').notNullable();
        table.integer('sleep_duration').notNullable();
        table.string('quality_of_sleep').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('fitness_info');
};
