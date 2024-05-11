const jwt = require("jsonwebtoken")

const checkUser = (req, res, next)=>{
    const token = req.cookies.nexusPlus

    const reveal = jwt.decode(token, process.env.JWTKEY)
    req.user = reveal
    next()
}

module.exports = {checkUser}