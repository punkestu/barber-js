module.exports = function () {
    const repo = new (require("./repo/person"))();
    const usecase = new (require("./usecase/auth"))(repo);
    const handler = new (require("./handler/http/handler"))(usecase);
    return {http: require("./handler/http/route")(handler), repo};
}