const express= require('express')
const router = express.Router()
const {getUsers,createUser,updateUser,loginUser} = require('../Controller/user.controller')

router.get('/get',getUsers)
router.post('/post',createUser)
router.put('/put/:id',updateUser)
router.post('/login',loginUser)

module.exports = router