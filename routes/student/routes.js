const express = require("express")
const router = express.Router()
const auth = require("../../middlewares/auth.middleware")
const account = require("../../controllers/student/account.controller")
const imageUploader = require("../../helpers/image-upload")

router.post('/create', account.create)
router.post('/login', account.login)
router.put('/update/password', auth, account.changePassword)
router.put('/update/profile', auth, account.changeProfile)
router.put('/update/picture', auth, imageUploader, account.changePicture)

module.exports = router