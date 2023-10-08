const {Verify} = require("../lib/jwt");

module.exports = function (personRepo) {
    return {
        isAuth: async (req, res, next) => {
            try {
                if(!req.headers.authorization){
                    throw null;
                }
                const userClaim = await Verify(req.headers.authorization.slice(7));
                if(!userClaim.id) {
                    throw null;
                }
                req.user = await personRepo.LoadOne({id:userClaim.id});
                if(!req.user){
                    throw null;
                }
                next();
            } catch (err) {
                return res.sendStatus(401);
            }
        },
        isAdmin: (req, res, next) => {
            if(req.user && req.user.role === "ADMIN") {
                return next();
            }
            return res.sendStatus(403);
        }
    }
}