const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const adminShema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    }, 
    password:{
        type: String,
        required: true
    },
    role:{
        emus: ["user", "admin"],
        default:"admin",
        type: String
    },
    createAt:{
        type: Date,
        default: Date.now
    }

})

adminShema.pre("save", async function(next){
    const comparePassword = this.password
    const genSalt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(comparePassword, genSalt)
    this.password = hashPassword
    next()
})

module.exports = mongoose.model("admin", adminShema)