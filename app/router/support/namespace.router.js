const {NameSpaceController} = require("../../controllers/support/namespace.controller");

const router = require("express").Router();

router.post("/add",NameSpaceController.addNameSpace)
router.get("/list",NameSpaceController.getListOfNameSpaces)

module.exports = {
    nameSpaceSectionRouter: router,
}