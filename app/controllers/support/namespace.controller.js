const conversationModel = require("../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes")
const Controller = require("../controller");
const createHttpError = require("http-errors");

class NameSpaceController extends Controller{
    async addNameSpace(req,res,next){
        try {
            const {title , endpoint} = req.body;
            await this.checkExistNameSpaceByEndpoint(endpoint);
            const conversation = await conversationModel.create({title,endpoint});
            return res.status(HttpStatus.CREATED).json({
                statusCode:HttpStatus.CREATED,
                data:{
                    message:"فضای مکالمه با موفقیت ایجاد شد",
                },
            });
        } catch (err) {
            next(err)
        }
    }
    async getListOfNameSpaces(req,res,next){
        try {
            const nameSpaces = await conversationModel.find({},{rooms:0,__v:0});
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data:{
                    nameSpaces
                }
            })
        } catch (err) {
            next(err)
        }
    }
    async checkExistNameSpaceByEndpoint(endpoint){
        const conversation = await conversationModel.findOne({endpoint});
        if(conversation) throw createHttpError.BadRequest("این اسم قبلا انتخاب شده است")
    }
}
module.exports = {
    NameSpaceController: new NameSpaceController()
}