/**
 * This function checks the validity of a student's first name based on certain conditions.
 * 
 * @param {string} first_name - The first name of the student to be validated.
 * @returns {boolean} - True if the first name is valid, false otherwise.
 */


function checkStudentFirstName(first_name) {
    if (
        first_name == null ||
        first_name.length <= 1 ||
        typeof first_name !== "string" ||
        first_name.length > 20
    ) {
        return false;
    }

    return true;
}


/**
 * This function checks the validity of a student's last name based on certain conditions.
 * 
 * @param {string} last_name - The last name of the student to be validated.
 * @returns {boolean} - True if the last name is valid, false otherwise.
 */

function checkStudentLastName(last_name) {
    return typeof last_name === "string" && last_name.length > 0 && last_name.length <= 20;
}


/**
 * This function checks the validity of a student's age based on certain conditions.
 * 
 * @param {number} age - The age of the student to be validated.
 * @returns {boolean} - True if the age is valid, false otherwise.
 */

function checkStudentAge(age) {
    return age !== null && !isNaN(age) && Number.isInteger(age) && age > 0 && age <= 200;
}


/**
 * This function checks the validity of a student's email based on certain conditions.
 * 
 * @param {string} email - The email of the student to be validated.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */

function checkStudentEmail(email) {
     // A simple check for non-empty string and basic email format
     return typeof email === "string" && email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


module.exports = {
    checkStudentFirstName,
    checkStudentAge,
    checkStudentEmail,
    checkStudentLastName
};
