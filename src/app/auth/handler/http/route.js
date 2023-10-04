module.exports = function (handler) {
    const router = require("express").Router();
    router.post("/registration", handler.Registration);
    router.post("/auth", handler.Authentication);
    return router;
}