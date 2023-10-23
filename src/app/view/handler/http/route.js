module.exports = function (handler, authMid) {
    const router = require("express").Router();
    router.get("/", authMid.isAuth({view: true}), handler.Index);
    router.get("/login", authMid.isAuth({view: true, negate: true}), handler.Login);
    router.get("/register", authMid.isAuth({view: true, negate: true}), handler.Register);
    router.post("/auth/login", authMid.isAuth({view: true, negate: true}), handler.AuthLogin);
    router.post("/auth/register", authMid.isAuth({view: true, negate: true}), handler.AuthRegister);
    router.get("/order", authMid.isAuth({view: true}), handler.Order);
    router.get("/ticket", authMid.isAuth({view: true}), handler.Ticket);
    router.post("/app/order", authMid.isAuth({view: true}), handler.CreateOrder);
    router.get("/schedule", authMid.isAuth({view: true}), handler.GetSchedule);
    router.get("/admin", authMid.isAuth({view: true}), handler.AdminOrder);
    router.get("/admin/acceptance/:id", authMid.isAuth({view: true}), handler.OrderAccept);
    router.get("/admin/rejection/:id", authMid.isAuth({view: true}), handler.OrderReject);
    return router;
}