const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique: true,
        lowercase: true, // Converts email to lowercase before saving
        match: [
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          'Please enter a valid email address' // Custom error message
        ]
    },
    password:{
        type:String,
        required:true
    }
})

const result = new mongoose.model("login data",schema)
module.exports = result
