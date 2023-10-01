const router = require("express").Router();
const { nameSpaceSectionRouter } = require("./support/namespace.router");
const { supportSectionRouter } = require("./support/support.router");

router.use("/support",supportSectionRouter)

module.exports = {
    AllRoutes: router,
}