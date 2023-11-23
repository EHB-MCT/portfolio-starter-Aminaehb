/**
table.increments('id').primary();
table.string('first_name').notNullable();
table.string('last_name').notNullable();
table.integer('age').notNullable();
table.string('email').unique().notNullable();
 */


function checkStudentPostEndpoint(params) {


    return false
}

module.exports = {
    checkStudentPostEndpoint
}