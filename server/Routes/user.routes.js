const express= require('express')
const router = express.Router()
const {getUsers,createUser} = require('../Controller/user.controller')

router.get('/get',getUsers)
router.post('/post',createUser)

module.exports = router