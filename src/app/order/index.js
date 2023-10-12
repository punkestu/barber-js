module.exports = function (authMid) {
    const repo = new (require("./repo/order"))();
    const service = new (require("./service/order"))(repo);
    const handler = new (require("./handler/http/handler"))(service);
    const http = require("./handler/http/route")(handler, authMid);
    return {
        http, repo
    }
}