const express= require('express')
const router = express.Router()
const {getUsers} = require('../Controller/user.controller')

router.get('/get',getUsers)


module.exports = router