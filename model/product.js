const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title:{
        type: String
    },
    price:{
        type: Number
    },
    message:{
        type: String
    },
    firstName:{
        type:String
    },
    address:{
        type:String
    },
    category:{
        type:String
    },
    country:{
        type: String
    },
    brand:{
        type:String
    },
    condition:{
        type: String
    },
    images:[{type:String}],
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("product", productSchema)