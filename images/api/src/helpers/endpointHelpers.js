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



module.exports = {
    checkStudentFirstName
}