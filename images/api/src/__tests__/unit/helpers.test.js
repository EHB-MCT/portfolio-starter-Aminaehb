const { checkStudentFirstName } = require ("../../helpers/endpointHelpers.js");
const { checkStudentLastName } = require("../../helpers/endpointHelpers.js");
const { checkStudentAge } = require("../../helpers/endpointHelpers.js");
const { checkStudentEmail } = require("../../helpers/endpointHelpers.js");
const {
    validatePhysicalActivity,
    validateExerciseDuration,
    validateAnxietyControl,
    validateSleepDuration,
    validateQualityOfSleep,
} = require("../../helpers/endpointHelpers.js");


/**
table.increments('id').primary();
table.string('first_name').notNullable();
table.string('last_name').notNullable();
table.integer('age').notNullable();
table.string('email').unique().notNullable();
 */

test("check first_name", () => {

    //what can my user not do
    expect(checkStudentFirstName("")).toBe(false); // Empty string is not a valid first_name
    expect(checkStudentFirstName(null)).toBe(false); // Null is not a valid first_name
    expect(checkStudentFirstName("i")).toBe(false); // Non-string value is not valid
    expect(checkStudentFirstName(1)).toBe(false); // Length greater than 20 is not valid
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

test("check physical_activity", () => {
    // What can my user not do
    expect(validatePhysicalActivity("")).toBe(false); // Empty string is not a valid physical_activity
    expect(validatePhysicalActivity(null)).toBe(false); // Null is not a valid physical_activity
    expect(checkStudentFirstName(1)).toBe(false); // Length greater than 20 is not valid


    // Valid physical_activity values
    expect(validatePhysicalActivity("Jogging")).toBe(true);
    expect(validatePhysicalActivity("Walking")).toBe(true);
    expect(validatePhysicalActivity("Sports")).toBe(true);
    expect(validatePhysicalActivity("Gym")).toBe(true);
});

test("check exercise_duration", () => {
    // What can my user not do
    expect(validateExerciseDuration("")).toBe(false); // Empty string is not a valid exercise_duration
    expect(validateExerciseDuration(null)).toBe(false); // Null is not a valid exercise_duration
    expect(validateExerciseDuration("abc")).toBe(false); // Non-numeric value is not a valid exercise_duration
    expect(validateExerciseDuration("25.5")).toBe(false); // Decimal value is not a valid exercise_duration
    expect(validateExerciseDuration(-10)).toBe(false); // Negative value is not a valid exercise_duration

    // Valid exercise_duration values
    expect(validateExerciseDuration(3)).toBe(true);
    expect(validateExerciseDuration(15)).toBe(true);
    expect(validateExerciseDuration(40)).toBe(true);
});

test("check anxiety_control", () => {
    // What can my user not do
    expect(validateAnxietyControl(null)).toBe(false); // Null is not a valid anxiety_control
    expect(validateAnxietyControl("High")).toBe(false); // Assuming only numeric values are valid

    // Valid anxiety_control values
    expect(validateAnxietyControl(0)).toBe(true);
    expect(validateAnxietyControl(5)).toBe(true);
});

test("check sleep_duration", () => {
    // What can my user not do
    expect(validateSleepDuration("")).toBe(false); // Empty string is not a valid sleep_duration
    expect(validateSleepDuration(null)).toBe(false); // Null is not a valid sleep_duration
    expect(validateSleepDuration("High")).toBe(false); // Assuming only numeric values are valid

    // Valid sleep_duration values
    expect(validateSleepDuration(2)).toBe(true);
    expect(validateSleepDuration(10)).toBe(true);
});


test("check quality_of_sleep", () => {
    // What can my user not do
    expect(validateQualityOfSleep("")).toBe(false); // Empty string is not a valid quality_of_sleep
    expect(validateQualityOfSleep(null)).toBe(false); // Null is not a valid quality_of_sleep

    // Valid quality_of_sleep values
    expect(validateQualityOfSleep("Restful")).toBe(true);
    expect(validateQualityOfSleep("Disturbed")).toBe(true);
});
