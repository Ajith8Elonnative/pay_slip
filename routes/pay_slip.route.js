const express = require('express')
const usercontrol = require('../controller/pay_slip.controller.js')
const route = express.Router()

route.get('/getAll', usercontrol.getAll)

route.get('/getByMonth/:paymentDate', usercontrol.getByMonth)

route.post('/create', usercontrol.create)

route.post('/create/email/:email', usercontrol.sendEmail)

// route.put('/update/:id', usercontrol.update)

route.delete('/delete/:id', usercontrol.delete)

module.exports = route