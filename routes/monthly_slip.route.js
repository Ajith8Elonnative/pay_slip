const express = require('express');
const usercontrol = require('../controller/monthly_slip.controller.js')
const route = express.Router()

// route.post('/store_slip', usercontrol.create)

route.get('/get_slip', usercontrol.getSlip)

module.exports = route