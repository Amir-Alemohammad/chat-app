const conversationModel = require("../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes")
const Controller = require("../controller");

class NameSpaceController extends Controller{
    async addNameSpace(req,res,next){
        try {
            const {title , endpoint} = req.body;
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
            const nameSpaces = await conversationModel.find({},{rooms:0,});
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
}
module.exports = {
    NameSpaceController: new NameSpaceController()
}