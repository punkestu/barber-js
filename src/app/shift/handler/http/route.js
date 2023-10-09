module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.post("/", authMid.isAuth, authMid.isAdmin, handler.CreateShift);
    router.put("/", authMid.isAuth, authMid.isAdmin, handler.UpdateShift);
    router.delete("/", authMid.isAuth, authMid.isAdmin, handler.DeleteShift);
    return router;
}