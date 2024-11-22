const express = require('express')
const usercontroler = require("../controller/login.controller.js")
const {verifyToken} = require('../controller/login.controller.js')
const routes = express.Router()

routes.get('/getAll', usercontroler.getAll)

routes.post('/signup', usercontroler.signupUser)

routes.post('/login', usercontroler.loginUser)

routes.get('/profile',verifyToken, usercontroler.userVerify)

module.exports = routes