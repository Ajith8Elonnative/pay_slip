const empAttendance = require('../model/attendance.model.js')
const monthAttendance = require('../model/monthly_attendance.model.js')


exports.create = async (req, res) => {
    try {
        const { empId, date, attendance, weekOff, reason, presentInMonth = 0, absentInMonth = 0, hfDayAbsentInMonth = 0, leaveInMonth = 0, holidayInMonth = 0 } = req.body
        let present = 0;
        let absent = 0;
        let hfDayAbsent = 0;
        let leave = 0;
        let holiDay = 0;

        if (attendance === "Present") present = 1
        if (attendance === "Absent") absent = 1
        if (attendance === "Half-Day") hfDayAbsent = 1
        if (attendance === "Leave") leave = 1

        if ((attendance === "Present" || attendance === "Absent" || attendance === "Half-Day" || attendance === "Leave") && weekOff) {
            return res.status(400).json({
                message: "WeekOff should not be selected once attendance is marked."
            });
        }

        if (weekOff === "Saturday" || "Sunday" || "Others") holiDay = 1

        if (attendance === "Leave" && !reason) {
            return res.status(400).json({
                message: "Reason is required when attendance is marked as 'Leave'."
            });
        }
        const existAttendance = await empAttendance.findOne({ empId: empId, date: date })
        if (existAttendance) {
            return res.status(400).json({ message: "Already resister this date.choose another date or check the employee id" })
        }

        const create = await new empAttendance({
            empId,
            date,
            attendance,
            weekOff,
            reason,
            presentInMonth: presentInMonth + present,
            absentInMonth: absentInMonth + absent,
            hfDayAbsentInMonth: hfDayAbsentInMonth + hfDayAbsent,
            leaveInMonth: leaveInMonth + leave,
            holidayInMonth: holidayInMonth+holiDay
        })
        const saveAttendance = await create.save()

        const [day, month, year] =await date.split('-')
        const convertMonthDate = year+"-"+month
        const findMonthdata = await monthAttendance.find({monthDate:convertMonthDate})
        
        if(findMonthdata.length === 0){
            console.log("iffffff")
            const createMonthAttendance = await new monthAttendance({
                employeeId:empId,
                monthDate:convertMonthDate,
                totalPresents:presentInMonth,
                totalAbsents:absentInMonth,
                totalLeaves:leaveInMonth,
                totalHolidays:holidayInMonth
            })
            await createMonthAttendance.save()
        }else{
            console.log("elseeeee")
        }

        return res.status(200).json({
            message: "employee attendace resister successfully",
            data: saveAttendance
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}