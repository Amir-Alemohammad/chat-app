const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
    fullname:{type:String,required:true},
    mobile:{type:String,required:true},
    password:{type:String,required:true}
});
const userModel = mongoose.model("userModel",Schema)
module.exports = userModel;