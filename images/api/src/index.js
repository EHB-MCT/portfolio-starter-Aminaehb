const express = require("express");
const knex = require("knex");
const dotenv = require('dotenv'); // Add this line
const path = require('path');
const cors = require('cors');


dotenv.config({ path: '.env' }); // Add this line

const app = express();
const knexfile = require("./db/knexfile");
const db = knex(knexfile.development);

console.log(knexfile)
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));


// Handle requests for the HTML file
app.get('/threejs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'threejs.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


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

// ------------------------------------- Student Info Endpoints -----------------------------------------------

/**
 * GET endpoint for retrieving all students.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
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
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing the requested student's information or an error message.
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
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */

app.post('/api/students', async (req, res) => {
  console.log('Received POST request:', req.body);

  if (!req.body) {
    return res.status(400).json({
      error: "Request body is missing or empty",
    });
  }

  const { first_name, last_name, age, email } = req.body;

  try {
    const [id] = await db('students').insert({
      first_name,
      last_name,
      age,
      email,
    }).returning('id');
  
    const createdStudent = {
      id,
      first_name,
      last_name,
      age,
      email,
    };
  
  
    return res.status(201).json([createdStudent]); // Wrap the object in an array
  } catch (error) {
    console.error('Error during student insertion:', error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "An internal server error occurred",
    });
  }  
});


/**
 * PUT endpoint for updating a specific student by ID.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
app.put('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { first_name, last_name, age, email } = req.body;

  if (!first_name || !last_name || !age) {
    return res.status(400).send({
      error: "Missing or incomplete request data",
    });
  }

  try {
    // Retrieve the existing student record
    const existingStudent = await db('students')
      .where('id', studentId)
      .first();

    if (!existingStudent) {
      return res.status(404).send({
        error: "Student not found",
      });
    }

    // Check if the email is provided and different from the current email
    const emailChanged = email && email !== existingStudent.email;

    if (emailChanged) {
      // Check if the new email already exists in the database
      const emailExists = await db('students')
        .where('email', email)
        .whereNot('id', studentId)
        .first();

      if (emailExists) {
        return res.status(409).send({
          error: "Email address already exists for another student",
        });
      }
    }

    // Update the student record
    const updatedCount = await db('students')
      .where('id', studentId)
      .update({ first_name, last_name, age, email });

    if (updatedCount === 0) {
      return res.status(404).send({
        error: "Student not found",
      });
    }

    // Log the update information
    console.log(`Student with ID ${studentId} updated:`, req.body);

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
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
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

    // Log the delete information
    console.log(`Student with ID ${studentId} deleted`);

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

// ------------------------------------- Fitness Info Endpoints -----------------------------------------------

/**
 * GET endpoint for retrieving fitness information.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either fitness information or an error.
 */
app.get('/api/fitness_info', async (req, res) => {
    try {
      // Retrieve all entries from the 'fitness_info' table
      const fitnessInfo = await db('fitness_info').select('*');
  
      // Send the retrieved fitness information as a response
      res.status(200).send(fitnessInfo);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).send({
        error: "Something went wrong",
        value: error,
      });
    }
  });
  
/**
 * GET endpoint for retrieving fitness information by ID.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either fitness information or an error.
 */
// Modify the endpoint for retrieving fitness information by ID
app.get('/api/fitness_info/:id', async (req, res) => {
  const fitnessId = req.params.id;

  try {
      // Retrieve fitness information by ID from the 'fitness_info' table
      const fitnessInfo = await db('fitness_info').where({ id: fitnessId }).first();

      // Check if the fitness information exists
      if (!fitnessInfo) {
          return res.status(404).send({
              error: "Fitness information not found",
          });
      }

      // Include the 'id' property in the response
      fitnessInfo.id = { id: fitnessId };

      // Send the retrieved fitness information as a response
      res.status(200).send(fitnessInfo);
  } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).send({
          error: "Something went wrong",
          value: error,
      });
  }
});


/**
 * POST endpoint for creating a new entry in the 'fitness_info' table.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
app.post('/api/fitness_info', async (req, res) => {
  if (!req.body) {
      return res.status(400).json({
          error: "Request body is missing or empty",
      });
  }

  // Destructure the required and optional parameters from the request body
  const { student_id, physical_activity, exercise_duration, anxiety_control, sleep_duration, quality_of_sleep } = req.body;

  // Check if sleep_duration is provided, if not, set a default value or handle it accordingly
  const actualSleepDuration = sleep_duration || 0; // Set a default value or handle it based on your business logic

  try {
      // Insert a new entry into the 'fitness_info' table
      await db('fitness_info').insert({
          student_id,
          physical_activity,
          exercise_duration,
          anxiety_control,
          sleep_duration: actualSleepDuration,  // Use the actual sleep duration
          quality_of_sleep,
      });
      

      // Log a message to the terminal
      console.log('Fitness info submitted successfully:', req.body);

      // Send a success response
      res.status(201).json({
          message: 'Fitness info created successfully',
          data: req.body,  
      });
  } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({
          error: "Something went wrong",
          value: error,
      });
  }
});


/**
 * PUT endpoint for updating fitness information by ID.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
app.put('/api/fitness_info/:id', async (req, res) => {
  const fitnessId = req.params.id;

  // Ensure that the request body is not empty
  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing or empty",
    });
  }

  // Destructure the parameters from the request body
  const { student_id, physical_activity, exercise_duration, anxiety_control, sleep_duration, quality_of_sleep } = req.body;

  try {
    // Check if the fitness information exists
    const existingFitnessInfo = await db('fitness_info').where({ id: fitnessId }).first();

    if (!existingFitnessInfo) {
      return res.status(404).send({
        error: "Fitness information not found",
      });
    }

    // Update the fitness information in the 'fitness_info' table
    await db('fitness_info').where({ id: fitnessId }).update({
      student_id,
      physical_activity,
      exercise_duration,
      anxiety_control,
      sleep_duration,
      quality_of_sleep,
    });

    // Log a message to the terminal
    console.log('Fitness info updated successfully:', req.body);

    // Send a success response
    res.status(200).send({
      message: 'Fitness info updated successfully',
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

/**
 * DELETE endpoint for removing fitness information by ID.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
// DELETE endpoint for removing fitness information by ID.
app.delete('/api/fitness_info/:id', async (req, res) => {
  const fitnessId = req.params.id;

  try {
    // Check if the fitness information exists
    const existingFitnessInfo = await db('fitness_info').where({ id: fitnessId }).first();

    if (!existingFitnessInfo) {
      return res.status(404).send({
        error: "Fitness information not found",
      });
    }

    // Remove the fitness information from the 'fitness_info' table
    await db('fitness_info').where({ id: fitnessId }).del();

    // Log a message to the terminal
    console.log('Fitness info deleted successfully. ID:', fitnessId);

    // Send a success response with the deleted fitness info data
    res.status(200).send({
      message: 'Fitness info deleted successfully',
      data: existingFitnessInfo, // Include the deleted fitness info data in the response
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



