const {Verify} = require("../lib/jwt");

module.exports = function (personRepo) {
    return {
        isAuth: async (req, res, next) => {
            try {
                const token = req.headers.authorization || req.cookies.TOKEN;
                if (!token) {
                    throw null;
                }
                let userClaim;
                if(!req.cookies.TOKEN){
                    userClaim = await Verify(token.slice(7));
                }else{
                    userClaim = await Verify(token);
                }
                if (!userClaim.id) {
                    throw null;
                }
                req.user = await personRepo.LoadOne({id: userClaim.id});
                if (!req.user) {
                    throw null;
                }
                next();
            } catch (err) {
                return res.sendStatus(401);
            }
        },
        isAdmin: (req, res, next) => {
            if (req.user && req.user.role === "ADMIN") {
                return next();
            }
            return res.sendStatus(403);
        },
        isClient: (req, res, next) => {
            if (req.user && req.user.role === "CLIENT") {
                return next();
            }
            return res.sendStatus(403);
        }
    }
}