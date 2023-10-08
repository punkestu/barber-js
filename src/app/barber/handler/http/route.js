module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.post("/", authMid.isAuth, authMid.isAdmin, handler.RegisterShift);
    router.delete("/", authMid.isAuth, authMid.isAdmin, handler.DropShift);
    router.put("/", authMid.isAuth, authMid.isAdmin, handler.ToggleShift);
    return router;
}