const express = require("express")
const { getRegisterAdmin, getAdminLogin, postRegisterAdmin } = require("../controllers/adminControl")
const router = express.Router()

router.get("/adminSignUp", getRegisterAdmin)
router.get("/adminLogin", getAdminLogin)
router.post("/adminSignUp", postRegisterAdmin)


module.exports = router
