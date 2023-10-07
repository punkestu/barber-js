module.exports = function (handler) {
    const router = require("express").Router();
    router.post("/", handler.RegisterShift);
    router.delete("/", handler.DropShift);
    router.put("/", handler.ToggleShift);
    return router;
}