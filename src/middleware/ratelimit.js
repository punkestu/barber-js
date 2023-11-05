module.exports = function (req, res, next) {
    if (req.cookies.ratelimit > 100) {
        return res.sendStatus(429);
    }
}