const fs = require("fs")
const path = require("path")
const createError = require("http-errors");
const userModel = require("../models/user");
const JWT = require("jsonwebtoken");
const createHttpError = require("http-errors");

function signAccessToken(userId){
    return new Promise(async (resolve,reject) => {
        const user = await userModel.findById(userId)
        const payload = {
            id : user._id,
            mobile : user.mobile,
            fullname : user.fullname,
        }
        console.log(payload)
        const options = {
            expiresIn: "1d"
        }
        JWT.sign(payload,process.env.JWT_SECRET,options,(err,token) => {
            if(err) reject(createHttpError.InternalServerError("خطایی از سمت سرور رخ داده است"))
            resolve(token)
        })
    })
}
function createRoute(req) {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1 + "";
    const day = date.getDate().toString();
    const directory = path.join(process.cwd(),"public","uploads","blogs",year,month,day);
    req.body.fileUploadPath = path.join("uploads", "blogs", year, month, day);
    fs.mkdirSync(directory, { recursive: true });
    return directory;
}
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    const mimetypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (mimetypes.includes(ext)) {
      return cb(null, true);
    }
    return cb(createError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
}
function removeFileInPublic(fileAddress){
    const filePath = path.join(process.cwd() , "public" , fileAddress);
    console.log(`File Deleted: ${fileAddress}`)
    fs.unlinkSync(filePath)
}
function clientHelper(req,res,next){
    // send request to client
    return {
        req,
    }
}
module.exports = {
    signAccessToken,
    createRoute,
    fileFilter,
    removeFileInPublic,
    clientHelper,
}