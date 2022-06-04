const express = require("express")
const router = express.Router()
const auth = require("../../middlewares/auth.middleware")
const account = require("../../controllers/student/account.controller")
const fileUploader = require("../../helpers/file-upload")

router.post('/create', account.create)
router.post('/login', account.login)
router.put('/update/password', auth, account.changePassword)
router.put('/update/picture', auth, fileUploader, account.changePicture)

module.exports = router