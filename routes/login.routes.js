const express = require('express')
const usercontroler = require("../controller/login.controller.js")
const routes = express.Router()

routes.get('/getAll', usercontroler.getall)

routes.post('/signup', usercontroler.signupUser)

routes.post('/login', usercontroler.loginUser)

module.exports = routes