const {SupportController} = require("../../controllers/support/support.controller");
const { nameSpaceSectionRouter } = require("./namespace.router");
const { RoomSectionRouter } = require("./room.router");

const router = require("express").Router();

router.get("/",SupportController.renderChatRoom)
router.use("/namespace",nameSpaceSectionRouter)
router.use("/room",RoomSectionRouter)

module.exports = {
    supportSectionRouter: router,
}