const router = require("express").Router();
const { nameSpaceSectionRouter } = require("./support/namespace.router");
const { supportSectionRouter } = require("./support/support.router");

router.use("/support",supportSectionRouter)
router.use("/support/namespace",nameSpaceSectionRouter)

module.exports = {
    AllRoutes: router,
}