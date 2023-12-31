const {Verify} = require("../lib/jwt");

module.exports = function (personRepo) {
    return {
        isAuth: ({view, negate}) => {
            return async (req, res, next) => {
                try {
                    const token = req.headers.authorization || req.cookies.TOKEN;
                    if (!token) {
                        throw null;
                    }
                    let userClaim;
                    if (!req.cookies.TOKEN) {
                        userClaim = await Verify(token.slice(7));
                    } else {
                        userClaim = await Verify(token);
                    }
                    if (!userClaim.id) {
                        throw null;
                    }
                    req.user = await personRepo.LoadOne({id: userClaim.id});
                    if (!req.user) {
                        throw null;
                    }
                    if (!negate) return next();
                    if (!view) return res.sendStatus(401);
                    return res.redirect("/login");
                } catch (err) {
                    if (!negate) {
                        if (!view) return res.sendStatus(401);
                        return res.redirect("/login");
                    }
                    return next();
                }
            }
        },
        isRole: ({role, view}) => (req, res, next) => {
            if (req.user && req.user.role === role) {
                return next();
            }
            return view ? res.redirect("/") : res.sendStatus(403);
        },
        isBanned: ({view, negate}) => (req, res, next) => {
            if (negate) {
                if (req.user && req.user.banned) {
                    if (req.originalUrl === "/ban-screen") return next();
                    return view ? res.redirect("/ban-screen") : res.sendStatus(403);
                }
                return next();
            } else {
                if (req.user && req.user.banned) {
                    return next();
                }
                return view ? res.redirect("/") : res.sendStatus(200);
            }
        },
        AdminGateway: async (req, res, next) => {
            if(req.user.role === "ADMIN") {
                return res.redirect("/admin");
            }
            next();
        }
    }
}
