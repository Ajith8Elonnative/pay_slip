const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const bodyparser = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger-output.json')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const empRoutes = require('./routes/emp.routes.js')
const calRoutes = require('./routes/pay_slip.route.js')
const saveRoutes = require('./routes/monthly_slip.route.js')
const loginRoutes = require('./routes/login.routes.js')
const resetPasswordRoutes = require('./routes/resetPassword.routes.js')
const attedanceRoutes = require('./routes/attendance.routes.js')
const monthlyAttendanceRoutes = require('./routes/monthly_attendance.routes.js')
const app = express()


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyparser.json())
app.use(express.json())
app.use(cors())
app.use('/public', express.static('public'))


if (swaggerDoc.components && swaggerDoc.components.headers) {
    delete swaggerDoc.components.headers['default']; // Replace 'Header-Name' with the actual header name
}

app.use('/emp-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
// app.use('/public', express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 12345;

mongoose.connect(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("mongodb is connected") })
    .catch((err) => { console.log("mongodb is not connected", err) })

app.use('/Pay_slip_employee', empRoutes)
app.use('/Pay_slip_calculate', calRoutes)
app.use('/pay_slip_savePdf', saveRoutes)
app.use('/pay_slip_login', loginRoutes)
app.use('/pay_slip_resetPassword', resetPasswordRoutes )
app.use('/pay_slip_attendance', attedanceRoutes)
app.use('/pay_slip_monthlyAttendance', monthlyAttendanceRoutes)

// app.get('/', async(req, res)=>{
//    const token = await jwt.sign({
//     date:new Date()
//    }, "ajith")
// res.json({
//     message:"success",
//     token
// })
// })

// app.get('/check/:token', async(req, res)=>{
//     const token = req.params.token
// try {
//     const verifyToken = await jwt.verify(token, "ajith")
//     if(verifyToken){
//         res.json({
//             message:"success",
//             data:new Date(verifyToken.date).getMonth()
//         })
//     }else{
//         res.status(400).json({message:"something went wrong"})
//     }
// } catch (error) {
//     res.status(500).json({message:error.message})
// }
   
    
// } )

app.listen(PORT, () => {
    console.log("servers is running on :", PORT)
})