const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
    fullname:{type:String,required:true},
    mobile:{type:String,required:true},
    token:{type:String,default:"Bearer Token"},
});
const userModel = mongoose.model("userModel",Schema)
module.exports = userModel;