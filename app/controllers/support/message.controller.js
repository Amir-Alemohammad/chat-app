const Controller = require("../controller");
const conversationModel = require("../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes")

class MessageController extends Controller{

}
module.exports = {
    MessageController: new MessageController()
}