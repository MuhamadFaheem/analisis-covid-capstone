const express = require('express')
var user = require('./user')
var router = express.Router()

router.post('/api/v1/register', user.regist)
router.post('/api/v1/login', user.login)
//router.get('/api/v1/riwayatku/:id', user.getHistory)
router.post('/api/v1/riwayat', user.postHistory)
router.put('/api/v1/edit', user.editProfileName)


module.exports = router