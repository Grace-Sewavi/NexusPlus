const mongoose = require("mongoose")


const contactSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    subject:{
        type:String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("contact", contactSchema)