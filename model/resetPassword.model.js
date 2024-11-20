const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Converts email to lowercase before saving
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please enter a valid email address' // Custom error message
    ]
  },
  createOtp: {
    type: String,
  
  },
  createdAt: { type: Date, default: Date.now, expires: 300 },

  newPassword:{
    type:String,
   
  },
  confirmPassword:{
    type:String,
   
  }
})
const reset = new mongoose.model('reset data', schema)
module.exports = reset