const mongoose  = require("mongoose");

const schema = new mongoose.Schema({
    employeeId:{
        type:String
    },
    monthDate:{
        type:String
    },
    totalPresents:{
        type:Number
    },
    totalAbsents:{
        type:Number
    },
    totalLeaves:{
        type:Number
    },
    totalHolidays:{
        type:Number
    }
})

const results = new mongoose.model('monthly_attendance', schema)
module.exports = results