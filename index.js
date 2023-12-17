const express = require("express"); // Phle express ko lao
const app = express(); // Express ka ek instance bnao or make a server

// Middleware for parsing json file.
app.use(express.json());


// Adding Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// Getting the data from env file also
require("dotenv").config();

// fetch the port no from the env file if u dont get then use port 4000.
const PORT = process.env.PORT||4000;

// Connecting with the database
const dbconnect = require("./config/dbconnect");

dbconnect();

// Mount the api
const routes = require("./routes/routes");
app.use("/api/v1",routes);

app.listen(PORT,() => {
    console.log(`Server Started at Port No : ${PORT}`);
});