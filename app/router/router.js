const router = require("express").Router();
const { supportSectionRouter } = require("./support/support.router");

router.use("/support",supportSectionRouter)

module.exports = {
    AllRoutes: router,
}