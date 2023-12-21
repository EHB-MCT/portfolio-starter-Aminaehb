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

/**
 * DELETE endpoint for removing fitness information by ID.
 * 
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
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
  
      // Send a success response
      res.status(200).send({
        message: 'Fitness info deleted successfully',
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

