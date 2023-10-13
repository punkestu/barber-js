module.exports = function(barberRepo) {
    const scheduleService = new (require("./service/schedule"))(barberRepo);
    const handler = new (require("./handler/http/handler"))(scheduleService);
    return {
        http: require("./handler/http/route")(handler)
    }
}