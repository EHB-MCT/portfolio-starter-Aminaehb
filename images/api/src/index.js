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
 * POST endpoint for creating a new student.
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

  const { id, first_name, last_name, age, email } = req.body;
  try {
      await db('students').insert({
          id,
          first_name,
          last_name,
          age,
          email,
      });
      res.status(201).send({
          message: 'Student created successfully',
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

