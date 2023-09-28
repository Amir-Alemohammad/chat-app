const Controller = require("./controller");

class SupportController extends Controller{
    async renderChatRoom(req,res,next){
        try {
            res.render("chat.ejs",{
                path:"/chat-room"
            })
        } catch (err) {
            next(err)
        }
    }
}
module.exports = {
    SupportController: new SupportController()
}
