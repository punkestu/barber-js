const tmr = require("../../../../middleware/tooManyReq");

module.exports = function (handler, authMid, rateLimiter) {
    const router = require("express").Router();

    router.get("/admin/orders", authMid.isAuth({view: false}), rateLimiter.expressMid, tmr.order, authMid.isRole({
        view: false,
        role: "ADMIN"
    }), handler.GetOrders);
    router.get("/admin/ban-list", authMid.isAuth({view: false}), rateLimiter.expressMid, tmr.banned, authMid.isRole({
        view: false,
        role: "ADMIN"
    }), handler.GetBanList);
    router.get("/schedule", authMid.isAuth({view: false}), rateLimiter.expressMid, tmr.schedules, handler.GetSchedule);

    router.get("/login", authMid.isAuth({view: true, negate: true}), handler.Login);
    router.get("/register", authMid.isAuth({view: true, negate: true}), handler.Register);
    router.post("/auth/login", authMid.isAuth({view: true, negate: true}), handler.AuthLogin);
    router.post("/auth/register", authMid.isAuth({view: true, negate: true}), handler.AuthRegister);

    router.use(authMid.isAuth({view: true}));
    router.get("/ban-screen", authMid.isBanned({view: true, negate: false}), handler.BanScreen);
    router.use(authMid.isBanned({view: true, negate: true}));

    router.get("/", authMid.AdminGateway, handler.Index);
    router.get("/profile", handler.Profile);
    router.get("/order", authMid.AdminGateway, handler.Order);
    router.get("/ticket", authMid.AdminGateway, handler.Ticket);
    router.post("/app/order", authMid.AdminGateway, handler.CreateOrder);

    router.use(authMid.isRole({view: true, role: "ADMIN"}));

    router.get("/admin", handler.AdminOrder);
    router.get("/admin-schedule", handler.AdminSchedule);
    router.get("/ban-list", handler.AdminBanList);
    router.get("/admin/acceptance/:id", handler.OrderAccept);
    router.get("/admin/rejection/:id", handler.OrderReject);
    router.get("/admin/white/:id", handler.OpenBan);
    router.delete("/admin/schedule/:id", handler.DeleteSchedule);
    router.post("/admin/schedule", handler.CreateSchedule);
    return router;
}
