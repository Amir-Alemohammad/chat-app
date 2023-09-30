const Controller = require("../controller");
const conversationModel = require("../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes")

class RoomController extends Controller{
    async addRoom(req,res,next){
        try {
            
        } catch (err) {
            next(err)
        }
    }
    async getListOfRooms(req,res,next){
        try {
            
        } catch (err) {
            next(err)
        }
    }
}
module.exports = {
    RoomController: new RoomController()
}