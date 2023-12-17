const mongoose = require("mongoose"); // need a instance of mongoose first

require("dotenv").config() ; // getting the instance for env to fetch the database url.


const dbconnect = ()=>{

    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database Connected Successfully")
    })
    .catch((error) => {
        console.log("Error in connecting to the database.")
    });
}

module.exports = dbconnect;

