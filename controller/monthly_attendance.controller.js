const monthAttendance = require('../model/monthly_attendance.model.js')

exports.getAll = async(req, res)=>{
    try {
        const getdata = await monthAttendance.find()
        res.status(200).json({
            message:"get month attendance successfully",
            data:getdata
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}