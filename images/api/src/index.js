const express = require("express")
const knex = require('knex');
const app = express();

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