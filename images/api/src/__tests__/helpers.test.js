const { checkStudentFirstName } = require ("./../helpers/endpointHelpers.js");


/**
table.increments('id').primary();
table.string('first_name').notNullable();
table.string('last_name').notNullable();
table.integer('age').notNullable();
table.string('email').unique().notNullable();
 */

test("check first_name", () => {

    //what can my user not do
    expect(checkStudentFirstName("")).toBe(false);
    expect(checkStudentFirstName(null)).toBe(false);
    expect(checkStudentFirstName("i")).toBe(false);
    expect(checkStudentFirstName(1)).toBe(false);
    expect(checkStudentFirstName("nknnjzenzejkjdebdhoahdzhihazdzbdkhzd")).toBe(false);

    expect(checkStudentFirstName("Amina")).toBe(true);
    expect(checkStudentFirstName("Mohammed Ali")).toBe(true);

})