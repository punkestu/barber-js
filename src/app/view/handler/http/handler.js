const {Sign} = require("../../../../lib/jwt");
const Errors = require("validatorjs/src/errors");
const {ErrSchedule} = require("../../../../domain/error");
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

class Handler {
    #service;
    #authService;
    #orderService;
    #shiftService;

    constructor(service, authService, orderService, shiftService) {
        this.#service = service;
        this.#authService = authService;
        this.#orderService = orderService;
        this.#shiftService = shiftService;
    }

    Index = async (req, res) => {
        try {
            const today = new Date().getDay();
            const day = req.query.day ? req.query.day : DAYS[today];
            res.render("index", {
                today,
                day,
                base: "",
                active: "home",
                cursor: null,
                state: req.user.role === "ADMIN" ? "admin" : "normal"
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    Order = async (req, res) => {
        const info = req.query.errors ? Buffer.from(req.query.errors, "base64").toString("ascii") : null;
        try {
            const client_id = req.user.id;
            const ticket = await this.#orderService.GetMyTicket(client_id);
            if (ticket) {
                return res.redirect("/ticket");
            }
            const today = new Date().getDay();
            const day = req.query.day ? req.query.day : DAYS[today];
            res.render("order", {today, day, base: "/order", active: "ticket", state: "normal", info});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    CreateOrder = async (req, res) => {
        const client_id = req.user.id;
        const {date, barber_id} = req.body;
        if (!date || !barber_id) {
            return res.redirect("back");
        }
        try {
            const ticket = await this.#orderService.GetMyTicket(client_id);
            if (ticket) {
                throw new ErrSchedule("tidak bisa booking 2 kali");
            }
            await this.#orderService.CreateOrder(new Date(date), client_id, parseInt(barber_id));
            res.redirect("/ticket");
        } catch (err) {
            if (err instanceof ErrSchedule) {
                const refererHost = req.headers.referer.split("?")[0];
                const refererQuery = req.headers.referer.split("?")[1];
                return res.redirect(`${
                    refererHost
                }?${
                    refererQuery ? refererQuery + "&" : ""
                }errors=${
                    Buffer.from(err.message).toString("base64")
                }`);
            }
            res.sendStatus(500);
        }
    }

    Ticket = async (req, res) => {
        const client_id = req.user.id;
        const ticket = await this.#orderService.GetMyTicket(client_id);
        if (ticket) {
            res.render("ticket", {ticket, active: "ticket", state: "normal"});
        } else {
            res.redirect("/order");
        }
    }

    Login = async (req, res) => {
        const errors = req.query.errors ? JSON.parse(Buffer.from(req.query.errors, "base64").toString("ascii")) : null;
        const prev = req.query.val ? JSON.parse(Buffer.from(req.query.val, "base64").toString("ascii")) : null;
        res.render("login", {active: null, state: "auth", errors, prev});
    }
    Register = async (req, res) => {
        const errors = req.query.errors ? JSON.parse(Buffer.from(req.query.errors, "base64").toString("ascii")) : null;
        const prev = req.query.val ? JSON.parse(Buffer.from(req.query.val, "base64").toString("ascii")) : null;
        res.render("register", {active: null, state: "auth", errors, prev});
    }

    AuthLogin = async (req, res) => {
        const {email, password} = req.body;
        try {
            const token = await this.#authService.Auth(email, password).then(person => Sign(person));
            res.cookie("TOKEN", token).redirect("/");
        } catch (err) {
            if (err instanceof Errors) {
                return res.redirect(`${
                    req.headers.referer.split("?")[0]
                }?errors=${
                    Buffer.from(JSON.stringify(err.errors)).toString("base64")
                }&val=${
                    Buffer.from(JSON.stringify({email})).toString("base64")
                }`);
            }
            res.sendStatus(500);
        }
    }

    AuthRegister = async (req, res) => {
        const {full_name, email, password, username, gender, address, phone} = req.body;
        try {
            const token = await this.#authService.Register(full_name, email, password, username, gender, address, phone)
                .then(person => Sign(person));
            res.cookie("TOKEN", token).redirect("/");
        } catch (err) {
            if (err instanceof Errors) {
                res.redirect(`${
                    req.headers.referer.split("?")[0]
                }?errors=${
                    Buffer.from(JSON.stringify(err.errors)).toString("base64")
                }&val=${
                    Buffer.from(JSON.stringify({
                        full_name,
                        email,
                        password,
                        username,
                        gender,
                        address,
                        phone
                    })).toString("base64")
                }`);
            }
            res.sendStatus(500);
        }
    }

    Profile = async (req, res) => {
        res.render("profile", {
            user: req.user,
            active: "profile",
            state: req.user.role === "ADMIN" ? "admin" : "normal"
        });
    }

    BanScreen = (req, res) => {
        res.render("ban-screen", {active: null, state: "normal"});
    }

    AdminOrder = async (req, res) => {
        try {
            res.render("admin", {active: "home", state: "admin"});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    AdminBanList = async (req, res) => {
        try {
            res.render("banlist", {active: "banlist", state: "admin"});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    AdminSchedule = async (req, res) => {
        try {
            const schedules = await this.#shiftService.GetShiftByDay(req.query.day || "SUN");
            res.render("adminSchedule", {
                active: "adminSchedule",
                state: "admin",
                day: req.query.day || "SUN",
                schedules
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    GetOrders = async (req, res) => {
        try {
            const id = req.query.id === "" ? undefined : req.query.id;
            const page = parseInt(req.query.page) || 0;
            const orders = await this.#orderService.GetForAdmin({id}, {page});
            res.render("components/orders", {orders, id, page});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    GetBanList = async (req, res) => {
        try {
            const email = req.query.email === "" ? undefined : req.query.email;
            const page = parseInt(req.query.page) || 0;
            const bans = await this.#authService.BanList({page, email});
            res.render("components/ban_list", {bans, email});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    OrderAccept = async (req, res) => {
        const {id} = req.params;
        try {
            await this.#orderService.UpdateState(parseInt(id), "ACCEPTED");
            const stateLabel = `<h3 id=\"order-state-${id}\" class="text-center font-bold text-2xl">ACCEPTED</h3>`
            return res.send(stateLabel);
        } catch (err) {
            return res.sendStatus(400);
        }
    }

    OrderReject = async (req, res) => {
        const {id} = req.params;
        try {
            const order = await this.#orderService.UpdateState(parseInt(id), "EXPIRED");
            const expiredOrder = await this.#orderService.GetMyExpiredOrder(order.client_id);
            if (expiredOrder.length >= 3) {
                await this.#authService.ToggleBan(order.client_id);
            }
            const stateLabel = `<h3 id=\"order-state-${id}\" class="text-center font-bold text-2xl text-red-600">EXPIRED</h3>`
            return res.send(stateLabel);
        } catch (err) {
            return res.sendStatus(400);
        }
    }

    OpenBan = async (req, res) => {
        const {id} = req.params;
        try {
            await this.#orderService.ClearOrder(parseInt(id));
            await this.#authService.ToggleBan(id);
            const email = req.query.email === "" ? undefined : req.query.email;
            const bans = await this.#authService.BanList({page: 0, email});
            res.render("components/ban_list", {bans, email});
        } catch (err) {
            return res.sendStatus(400);
        }
    }

    GetSchedule = async (req, res) => {
        try {
            const today = new Date().getDay();
            const day = req.query.day ? req.query.day : DAYS[today];
            const cursor = req.query.cursor;
            const barbers = await this.#service.GetSchedule(day);
            res.render("components/schedule_list", {barbers, day, cursor});
        } catch (err) {
            res.status(500).json(err);
        }
    }

    DeleteSchedule = async (req, res) => {
        try {
            await this.#shiftService.DeleteShift(req.params.id);
            await this.#service.SyncSchedule();
            res.send("");
        } catch (err) {
            res.status(500).json(err);
        }
    }
    CreateSchedule = async (req, res) => {
        try {
            const jam = (24 + parseInt(req.body.jam.split(":")[0]) - 7) % 24;
            const start = `${jam < 10 ? `0${jam}` : jam}:${req.body.jam.split(":")[1]}:00`;
            const end = [
                req.body.jam.split(":")[1] === "00" ?
                    (jam < 10 ? `0${jam}` : jam) :
                    (jam < 10 ? `0${jam}` : jam),
                req.body.jam.split(":")[1] === "00" ? "30" : "00",
                "00"
            ].join(":");
            const shift = await this.#shiftService.CreateShift(toTime(start), toTime(end), req.body.day);
            if(!shift) {
                throw new Error("failed to create shift");
            }
            await this.#service.CreateSchedule(shift.id);
            await this.#service.SyncSchedule();
            if (req.query.day === req.body.day) {
                return res.render("components/scheduleItem", {
                    start: start,
                    id: 1
                });
            }
            return res.send("");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

function toTime(time) {
    return new Date("1970-01-01T" + time);
}

module.exports = Handler;