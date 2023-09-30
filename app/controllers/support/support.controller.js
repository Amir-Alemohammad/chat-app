const Controller = require("../controller");

class SupportController extends Controller{
    async renderChatRoom(req,res,next){
            return res.render("chat.ejs",{
                pageTitle:"chat-room",
                path:"/chat-room",
            })
    }
}
module.exports = {
    SupportController: new SupportController()
}
