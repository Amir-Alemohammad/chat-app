const {SupportController} = require("../../controllers/support/support.controller");

const router = require("express").Router();

router.get("/",SupportController.renderChatRoom)

module.exports = {
    supportSectionRouter: router,
}