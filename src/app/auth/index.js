module.exports = function () {
    const repo = new (require("./repo/person"))();
    const service = new (require("./usecase/auth"))(repo);
    const handler = new (require("./handler/http/handler"))(service);
    return {service, http: require("./handler/http/route")(handler), repo};
}