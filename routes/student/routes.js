const express = require("express")
const router = express.Router()
// const auth = require("../../middleware/auth.middleware")
const account = require("../../controllers/student/account.controller")

router.post('/create', account.create)

module.exports = router