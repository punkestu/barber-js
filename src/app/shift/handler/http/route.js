module.exports = function (handler) {
    const router = require("express").Router();
    router.post("/", handler.CreateShift);
    router.put("/", handler.UpdateShift);
    router.delete("/", handler.DeleteShift);
    return router;
}