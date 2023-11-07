const {ErrTooManyReq} = require("../domain/error");

module.exports = {
    schedules: (req, res, next) => {
        if (req.error instanceof ErrTooManyReq) {
            return res.render("components/loading", {
                slot_id: "schedules-slot",
                endpoint: `/schedule?day=${req.query.day || ""}`
            })
        }
        next();
    },
    order: (req, res, next) => {
        if (req.error instanceof ErrTooManyReq) {
            return res.render("components/loading", {
                slot_id: "orders-slot",
                endpoint: `/admin/orders?id=${req.query.id || ""}`
            });
        }
        next();
    },
    banned: (req, res, next) => {
        if (req.error instanceof ErrTooManyReq) {
            return res.render("components/loading", {
                slot_id: "ban-list-slot",
                endpoint: `/admin/ban-list?email=${req.query.email || ""}`
            })
        }
        next();
    }
}