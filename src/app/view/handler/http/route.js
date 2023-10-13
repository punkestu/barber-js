module.exports = function (handler) {
    const router = require("express").Router();
    router.get("/", handler.Index);
    router.get("/schedule", handler.GetSchedule);
    return router;
}