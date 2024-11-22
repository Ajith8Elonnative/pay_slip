const express = require('express')
const usercontrol = require('../controller/resetPassword.controller.js')
const routes = express.Router()

routes.post('/sendOtp/:email', usercontrol.sentOtp)

routes.post('/verifyOtp', usercontrol.verifyOtp)

routes.post('/fogetPassword/:email', usercontrol.fogetPassword)

module.exports = routes