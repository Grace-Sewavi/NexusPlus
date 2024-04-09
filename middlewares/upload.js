const {v4: uuidv4} = require("uuid")

const spName =(imageName)=>{
    const fileExtension = imageName.split(".").pop()
    const newName = `${uuidv4()}.${fileExtension}`
    return newName
}

module.exports ={spName}