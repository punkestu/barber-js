module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.post("/", authMid.isAuth, authMid.isRole({role: "ADMIN"}), handler.CreateShift);
    router.put("/", authMid.isAuth, authMid.isRole({role: "ADMIN"}), handler.UpdateShift);
    router.delete("/", authMid.isAuth, authMid.isRole({role: "ADMIN"}), handler.DeleteShift);
    return router;
}