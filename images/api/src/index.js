const express = require("express");
const knex = require("knex");
const dotenv = require('dotenv'); // Add this line

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
 * PUT endpoint for updating a specific student by ID.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
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

  
app.listen(3000, (error)=> {
    if(!error){
        console.log("running on port " + 3000);
    }
    else {
        console.error(error)
    }
})

