const Controller = require("../controller");
const conversationModel = require("../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");
const { removeFileInPublic } = require("../../utils/function");
const { NameSpaceController } = require("./namespace.controller");

class RoomController extends Controller{
    async addRoom(req,res,next){
        try {
            const {name,description,namespace,image} = req.body;
            await this.checkExistRoomByName(name)
            await this.findConversationByEndpoint(namespace)    
            const room = {name,image,description};
            await conversationModel.updateOne({endpoint:namespace},{
                $push:{ rooms:room }
            });
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data:{
                    message:"اتاق با موفقیت ایجاد شد"
                }
            })
        } catch (err) {
            removeFileInPublic(req.body.image)
            next(err)
        }
    }
    async getListOfRooms(req,res,next){
        try {
            const conversations = await conversationModel.find({},{rooms:1})
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data:{
                    conversations
                },
            });
        } catch (err) {
            next(err)
        }
    }
    async checkExistRoomByName(name){
        const conversation = await conversationModel.findOne({"rooms.name":name})
        if(conversation) throw createHttpError.BadRequest("این اسم قبلا اینتخاب شده است")
    }
    async findConversationByEndpoint(endpoint){
        const conversation = await conversationModel.findOne({endpoint});
        if(!conversation) throw createHttpError.NotFound("فضای مکالمه ای یافت نشد")
        return conversation;
    }
}
module.exports = {
    RoomController: new RoomController()
}