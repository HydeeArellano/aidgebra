const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const logged = require("../../middlewares/logged.middleware");
const account = require("../../controllers/student/account.controller");
const imageUploader = require("../../helpers/image-upload");

router.post("/register", logged, account.register);
router.post("/login", logged, account.login);

router.post("/create", auth, account.create);

router.put("/update/password", auth, account.changePassword);
router.put("/update/profile", auth, account.changeProfile);
router.put("/update/picture", auth, imageUploader, account.changePicture);

router.get("/paginate", auth, account.paginate);
router.get("/", auth, account.all);
router.get("/:id", auth, account.view);

module.exports = router;
