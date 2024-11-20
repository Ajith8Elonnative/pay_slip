const  mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true, // Converts email to lowercase before saving
        match: [
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          'Please enter a valid email address' // Custom error message
        ]
    }
})