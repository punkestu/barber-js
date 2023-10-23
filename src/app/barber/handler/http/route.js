module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.post("/", authMid.isAuth, authMid.isRole({role:"ADMIN"}), handler.RegisterShift);
    router.delete("/", authMid.isAuth, authMid.isRole({role:"ADMIN"}), handler.DropShift);
    router.put("/", authMid.isAuth, authMid.isRole({role:"ADMIN"}), handler.ToggleShift);
    return router;
}