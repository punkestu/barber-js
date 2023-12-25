module.exports = function (authMid) {
    const repo = new (require("./repo/shift"))();
    const usecase = new (require("./usecase/shift"))(repo);
    const handler = new (require("./handler/http/handler"))(usecase);
    return {http: require("./handler/http/route")(handler, authMid), repo, usecase};
}