const express = require("express")
const router = express.Router()
const auth = require("../../middlewares/auth.middleware")
const account = require("../../controllers/admin/account.controller")

router.get('/paginate', account.paginate)
router.post('/create', account.create)
router.post('/login', account.login)
router.put('/update/password', auth, account.changePassword)
router.put('/update/profile', auth, account.changeProfile)
router.put('/update/user/details', account.changeUserDetails)

module.exports = router