const { checkStudentFirstName } = require ("../../helpers/endpointHelpers.js");
const { checkStudentLastName } = require("../../helpers/endpointHelpers.js");
const { checkStudentAge } = require("../../helpers/endpointHelpers.js");
const { checkStudentEmail } = require("../../helpers/endpointHelpers.js");


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


test("check last_name", () => {
    // What can my user not do
    expect(checkStudentLastName("")).toBe(false); // Empty string is not a valid last_name
    expect(checkStudentLastName(null)).toBe(false); // Null is not a valid last_name
    expect(checkStudentLastName(1)).toBe(false); // Non-string value is not valid
    expect(checkStudentLastName("nknnjzenzejkjdebdhoahdzhihazdzbdkhzd")).toBe(false); // Length greater than 20 is not valid

    // Valid last_name values
    expect(checkStudentLastName("Smith")).toBe(true);
    expect(checkStudentLastName("Johnson")).toBe(true);
    expect(checkStudentLastName("Von Trapp")).toBe(true);
});



test("check age", () => {

    // What can my user not do
    expect(checkStudentAge("")).toBe(false); // Empty string is not a valid age
    expect(checkStudentAge(null)).toBe(false); // Null is not a valid age
    expect(checkStudentAge("abc")).toBe(false); // Non-numeric value is not a valid age
    expect(checkStudentAge("25.5")).toBe(false); // Decimal value is not a valid age
    expect(checkStudentAge("300")).toBe(false); // Age cannot be greater than 200, for example

    // Valid age values
    expect(checkStudentAge(18)).toBe(true);
    expect(checkStudentAge(25)).toBe(true);
    expect(checkStudentAge(99)).toBe(true);

});

test("check email", () => {
    // What can my user not do
    expect(checkStudentEmail("")).toBe(false); // Empty string is not a valid email
    expect(checkStudentEmail(null)).toBe(false); // Null is not a valid email
    expect(checkStudentEmail("invalid-email")).toBe(false); // Invalid email format

    // Valid email values
    expect(checkStudentEmail("test@example.com")).toBe(true);
    expect(checkStudentEmail("user123@student.com")).toBe(true);
    expect(checkStudentEmail("john.doe@gmail.com")).toBe(true);
});
