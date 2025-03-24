const express= require('express')
const router = express.Router()
const {getUsers,createUser,updateUser} = require('../Controller/user.controller')

router.get('/get',getUsers)
router.post('/post',createUser)
router.put('/put/:id',updateUser)

module.exports = router