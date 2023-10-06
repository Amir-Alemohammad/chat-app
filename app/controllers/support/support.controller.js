const createHttpError = require("http-errors");
const userModel = require("../../models/user");
const Controller = require("../controller");
const { signAccessToken } = require("../../utils/function");

class SupportController extends Controller{
    async renderChatRoom(req,res,next){
            return res.render("chat.ejs",{
                pageTitle:"chat-room",
                path:"/chat-room",
            })
    }
    async renderLoginForm(req,res,next){
        return res.render("login.ejs",{
            path:"/login",
            pageTitle:"login",
            error:"",
        })
    }
    async login(req,res,next){
        const {mobile} = req.body;
        const user = await userModel.findOne({mobile})
        if(!user) return res.render("login.ejs",{
            pageTitle:"login",
            error:"شماره موبایل صحیح نمیباشد",
            path:"/login"
        });
        const token = await signAccessToken(user._id);
        res.cookie("authorization",token,{signed:true,httpOnly:true,expires: new Date(Date.now() + 1000 * 60 * 60 * 1)});
        await userModel.updateOne({mobile},{token,});      
        return res.redirect("/support")
    }
}
module.exports = {
    SupportController: new SupportController()
}
