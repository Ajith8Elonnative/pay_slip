const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    employeeId:{
        type:String
    },
    month:{
        type:Number
    },
    year:{
        type:Number
    },
    file:{
        type:String
    }

})

const savepdf = new mongoose.model('monthly pay_slip', schema)
module.exports = savepdf