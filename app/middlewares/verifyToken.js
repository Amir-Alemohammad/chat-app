const userModel = require("../models/user")

async function checkLogin(req,res,next){
    try {
        const token = req.signedCookies["authorization"]
        if(token){
            const user = await userModel.findOne({token});
            if(user){
                req.user = user;
                return next();
            }
        }
        return res.render("login.ejs",{
            pageTitle:"login",
            path:"/login",
            error:"لطفا وارد حساب کاربری خود شوید"
        });
    } catch (err) {
        next(err)
    }
}
async function checkAccessLogin(req,res,next){
    try {
        const token = req.signedCookies["authorization"];
        if(token){
            const user = await userModel.findOne({token});
            if(user){
                req.user = user;
                return res.redirect("/support");
            }
        }
        return next()
    } catch (err) {
        next(err)
    }
}
module.exports = {
    checkLogin,
    checkAccessLogin,
}