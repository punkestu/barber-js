module.exports = function (personRepo, shiftRepo) {
    const repo = new (require("./repo/barber"))();
    const usecase = new (require("./usecase/barber"))(repo, personRepo, shiftRepo);
    const handler = new (require("./handler/http/handler"))(usecase);
    return {http: require("./handler/http/route")(handler), repo};
}