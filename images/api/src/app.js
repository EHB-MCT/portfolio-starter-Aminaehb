const express = require("express");
const knex = require("knex");
const initEndpoints = require("./routes")

// Load knexfile
const knexfile = require("./db/knexfile");
// Initialize knex with the development configuration
const db = knex(knexfile.development);

// Initialize app and routes
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send(200)
})


module.exports = app;

    




