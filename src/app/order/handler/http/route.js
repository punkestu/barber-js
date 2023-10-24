module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.post("/", authMid.isAuth, authMid.isRole({role: "CLIENT"}), handler.CreateOrder);
    return router;
}