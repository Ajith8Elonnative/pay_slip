const express = require('express')
const routes = express.Router()
const usercontrol = require('../controller/monthly_attendance.controller.js')

routes.get('/getAll', usercontrol.getAll)

module.exports = routes