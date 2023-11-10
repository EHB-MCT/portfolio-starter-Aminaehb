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


app.get("/", (request, response) => {
   response.send({message: "hello world"})
})


app.listen(3000, (error)=> {
    if(!error){
        console.log("running on port " + 3000);
    }
    else {
        console.error(error)
    }
})

