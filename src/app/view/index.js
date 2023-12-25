module.exports = function(barberRepo, authService, orderService, shiftService, authMid, rateLimiter) {
    const scheduleService = new (require("./service/schedule"))(barberRepo);
    const handler = new (require("./handler/http/handler"))(scheduleService, authService, orderService, shiftService);
    return {
        http: require("./handler/http/route")(handler, authMid, rateLimiter)
    }
}