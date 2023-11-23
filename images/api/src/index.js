const express = require("express");
const knex = require("knex");
const dotenv = require('dotenv'); // Add this line
const { checkStudentFirstName } = require ("./helpers/endpointHelpers.js");


dotenv.config({ path: '.env' }); // Add this line

const app = express();

const knexfile = require("./db/knexfile");
const db = knex(knexfile.development);

console.log(knexfile)
app.use(express.json());

/**
 * GET endpoint, providing hello world
 * 
 * @param
 * @returns
 */

//this works!
app.get("/", (request, response) => {
   response.send({message: "hello world"})
})

/**
 * GET endpoint for retrieving all students.
 * 
 *  @param {Object} - The HTTP request object.
 *  @param {Object}- The HTTP response object.
 * @returns - The HTTP response containing a list of students or an error message.
 */

app.get('/api/students', async (req, res) => {
  try {
    const students = await db('students')

    res.status(200).send(students)
  } catch (error) {
    console.log(error);

    res.status(500).send({
      error: "Something went wrong",
      value: error
    });
  }
});

/**
 * GET endpoint for retrieving a specific student by ID.
 * 
 * @param {Object} - The HTTP request object.
 * @param {Object} - The HTTP response object.
 * @returns {Object} - The HTTP response containing the requested student's information or an error message.
 */

app.get('/api/students/:id', async (req, res) => {
const studentId = req.params.id;
try {
  const student = await db('students').where('id', studentId).first();

  if(!student) {
    return res.status(404).send({
      error: "Student not found",
    });
  }

  res.status(200).send(student)
} catch (error) {
  console.log(error);

  res.status(500).send({
    error: "Something went wrong",
    value: error
  });
}
});

/**
 * POST endpoint for creating a new student.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *  @returns {Object} - The HTTP response containing either a success message or an error.
 */
app.post('/api/students', async (req, res) => {
  
    // Check if the request body is missing or empty
    if (!req.body) {
      return res.status(400).send({
        error: "Request body is missing or empty",
      });
    }

    // Destructure the relevant properties from the request body
    const { id, first_name, last_name, age, email } = req.body;

    // Validate the format of the student's first name
   if (checkStudentFirstName(first_name)) {
    try {
      // Insert the new student into the database
      await db('students').insert({
        id,
        first_name,
        last_name,
        age,
        email,
      });

      // Send a success response
      res.status(201).send({
        message: 'Student created successfully',
      });
    } catch (error) {
      // Handle database insertion errors
      console.error(error);
      res.status(500).send({
        error: "Something went wrong",
        value: error,
      });
    }
  } else {
    // Send a response indicating that the name is not formatted correctly
    res.status(401).send({ message: "Name not formatted correctly" });
  }
});


/**
 * PUT endpoint for updating a specific student by ID.
 * 
 * @param {Object}- The HTTP request object.
 * @param {Object} - The HTTP response object.
 * @returns {Object} - The HTTP response containing either a success message or an error.
 */
app.put('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { first_name, last_name, age, email } = req.body;

  if (!first_name || !last_name || !age || !email) {
    return res.status(400).send({
      error: "Missing or incomplete request data",
    });
  }

  try {
    const updatedCount = await db('students')
      .where('id', studentId)
      .update({ first_name, last_name, age, email });

    if (updatedCount === 0) {
      return res.status(404).send({
        error: "Student not found",
      });
    }

    res.status(200).send({
      message: 'Student updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

/**
 * DELETE endpoint for deleting a specific student by ID.
 * 
 * @param {Object} - The HTTP request object.
 * @param {Object} - The HTTP response object.
 * @returns {Object} - The HTTP response containing either a success message or an error.
 */
app.delete('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const deletedCount = await db('students')
      .where('id', studentId)
      .del();

    if (deletedCount === 0) {
      return res.status(404).send({
        error: "Student not found",
      });
    }

    res.status(200).send({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});


app.listen(3000, (error)=> {
    if(!error){
        console.log("running on port " + 3000);
    }
    else {
        console.error(error)
    }
})

