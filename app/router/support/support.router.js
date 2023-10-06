const {SupportController} = require("../../controllers/support/support.controller");
const { checkLogin, checkAccessLogin } = require("../../middlewares/verifyToken");
const { nameSpaceSectionRouter } = require("./namespace.router");
const { RoomSectionRouter } = require("./room.router");

const router = require("express").Router();

router.get("/",checkLogin,SupportController.renderChatRoom)
router.get("/login",checkAccessLogin,SupportController.renderLoginForm)
router.post("/login",checkAccessLogin,SupportController.login)
router.use("/namespace",nameSpaceSectionRouter)
router.use("/room",RoomSectionRouter)

module.exports = {
    supportSectionRouter: router,
}