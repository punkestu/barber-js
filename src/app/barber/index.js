module.exports = function (personRepo, shiftRepo, authMid) {
    const repo = new (require("./repo/barber"))();
    const usecase = new (require("./usecase/barber"))(repo, personRepo, shiftRepo);
    const handler = new (require("./handler/http/handler"))(usecase);
    return {http: require("./handler/http/route")(handler, authMid), repo};
}