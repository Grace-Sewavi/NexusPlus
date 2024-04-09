const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    }
    ,email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()

    }
})


userSchema.pre("save", async function(next){
    const userPassword = this.password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userPassword, salt)
    this.password = hashedPassword
    next()
})


module.exports = mongoose.model("User", userSchema)