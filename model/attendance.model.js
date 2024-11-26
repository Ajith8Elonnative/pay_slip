const  mongoose  = require("mongoose");

const schema = new mongoose.Schema({
    empId:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required: true, // Ensure it's mandatory if needed
        default: Date.now, // Automatically set the current date if not provided
    },
    attendance:{
        type: String, 
        enum: ['Present', 'Absent', 'Half-Day','Leave'], 
         
    },
    reason:{
            type: String, 
    },
    weekOff:{
        type:String,
        enum: ['Saturday', 'Sunday', 'Others']
    },
    presentInMonth:{
        type:Number,  
    },
    absentInMonth:{
        type:Number,
    },
    hfDayAbsentInMonth:{
        type:Number,
    },
    leaveInMonth: {
        type:Number,
    },
    holidayInMonth: {
        type:Number,
    }

})
const results = new mongoose.model('Attendance',schema)
module.exports= results