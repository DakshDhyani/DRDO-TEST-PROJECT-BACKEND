// For the model to be created , we need mongoose
const mongoose = require("mongoose");

// Now create the schema for the model
const User = new mongoose.Schema(
    {
        name : {
            type:String,
            required:true,
        },

        email:{
            type:String,
            required:true,
        },

        password:{
            type:String,
            required: true,
        },
        
        role:{
            type:String,
            required:true,
            enum:["admin","testmanager","tester"]
        }

    }
);

module.exports = mongoose.model("User" , User);