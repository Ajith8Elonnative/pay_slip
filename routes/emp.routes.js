const express = require('express')
const usercontrol = require('../controller/emp.controller.js')
const route = express.Router()
route.get('/getAll', usercontrol.getAll)

route.get('/getId', usercontrol.getId)

route.post('/create', usercontrol.create)

route.put('/update/:id', usercontrol.update)

route.delete('/delete/:id', usercontrol.delete)


module.exports = route