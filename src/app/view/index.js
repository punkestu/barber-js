module.exports = function(barberRepo, authService, orderService, authMid, rateLimiter) {
    const scheduleService = new (require("./service/schedule"))(barberRepo);
    const handler = new (require("./handler/http/handler"))(scheduleService, authService, orderService);
    return {
        http: require("./handler/http/route")(handler, authMid, rateLimiter)
    }
}