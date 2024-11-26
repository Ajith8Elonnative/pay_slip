const express = require('express')
const usercontrol = require('../controller/attendance.controller.js')
const routes = express.Router()

routes.post('/emp_attendance', usercontrol.create)

module.exports = routes