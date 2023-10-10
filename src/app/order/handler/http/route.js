module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.post("/", authMid.isAuth, authMid.isClient, handler.CreateOrder);
    return router;
}