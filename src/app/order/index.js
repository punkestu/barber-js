module.exports = function (barberRepo, authMid) {
    const repo = new (require("./repo/order"))();
    const service = new (require("./usecase/order"))(repo, barberRepo);
    const handler = new (require("./handler/http/handler"))(service);
    const http = require("./handler/http/route")(handler, authMid);
    return {
        http, repo, service
    }
}