const express = require('express')
const bodyparser = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger-output.json')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const empRoutes = require('./routes/emp.routes.js')
const calRoutes = require('./routes/pay_slip.route.js')
const app = express()


app.use(bodyparser.json())
app.use(express.json())
app.use(cors())

if (swaggerDoc.components && swaggerDoc.components.headers) {
    delete swaggerDoc.components.headers['default']; // Replace 'Header-Name' with the actual header name
}

app.use('/emp-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/', (req, res) => {
    res.send("hi hello makkale, welcome ")
})

const PORT = process.env.PORT || 8080

mongoose.connect(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("mongodb is connected") })
    .catch((err) => { console.log("mongodb is not connected", err) })

app.use('/Pay_slip_employee', empRoutes)
app.use('/Pay_slip_calculate', calRoutes)

app.listen(PORT, () => {
    console.log("servers is running on :", PORT)
})