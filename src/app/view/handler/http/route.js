module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.get("/", authMid.isAuth, handler.Index);
    router.get("/order", authMid.isAuth, handler.Order);
    router.get("/login", handler.Login);
    router.get("/ticket", authMid.isAuth, handler.Ticket);
    router.get("/admin", authMid.isAuth, handler.AdminOrder);
    router.get("/admin/acceptance/:id", authMid.isAuth, handler.OrderAccept);
    router.get("/admin/rejection/:id", authMid.isAuth, handler.OrderReject);
    router.post("/auth/login", handler.AuthLogin);
    router.post("/app/order", authMid.isAuth, handler.CreateOrder);
    router.get("/schedule", authMid.isAuth, handler.GetSchedule);
    return router;
}