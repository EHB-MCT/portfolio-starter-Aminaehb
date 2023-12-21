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
 * POST endpoint for creating a new student with fitness information.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
app.post('/api/students', async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing or empty",
    });
  }

  const { id, first_name, last_name, age, email, fitnessInfo } = req.body;

  try {
    const studentId = await db('students').insert({
      id,
      first_name,
      last_name,
      age,
      email,
    }).returning('id');

    await db('fitness_info').insert({
      student_id: studentId[0],
      physical_activity: fitnessInfo.physical_activity,
      exercise_duration: fitnessInfo.exercise_duration,
      anxiety_control: fitnessInfo.anxiety_control,
      sleep_duration: fitnessInfo.sleep_duration,
      quality_of_sleep: fitnessInfo.quality_of_sleep,
    });

    console.log('Fitness information added successfully:', fitnessInfo);

    res.status(201).send({
      message: 'Student and fitness information created successfully',
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
 * POST endpoint for creating a new entry in the 'fitness_info' table.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
app.post('/api/fitness_info', async (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        error: "Request body is missing or empty",
      });
    }
  
    // Destructure the required parameters from the request body
    const { id, student_id, physical_activity, exercise_duration, anxiety_control, sleep_duration, quality_of_sleep } = req.body;
  
    try {
      // Insert a new entry into the 'fitness_info' table
      await db('fitness_info').insert({
        id,  // Assuming 'id' is provided in the request body
        student_id,
        physical_activity,
        exercise_duration,
        anxiety_control,
        sleep_duration,
        quality_of_sleep,
      });
  
      // Log a message to the terminal
      console.log('Fitness info submitted successfully:', req.body);
  
      // Send a success response
      res.status(201).send({
        message: 'Fitness info created successfully',
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

