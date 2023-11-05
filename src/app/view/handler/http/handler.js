const {Sign} = require("../../../../lib/jwt");
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

class Handler {
    #service;
    #authService;
    #orderService;

    constructor(service, authService, orderService) {
        this.#service = service;
        this.#authService = authService;
        this.#orderService = orderService;
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
        try {
            const client_id = req.user.id;
            const ticket = await this.#orderService.GetMyTicket(client_id);
            if (ticket) {
                return res.redirect("/ticket");
            }
            const today = new Date().getDay();
            const day = req.query.day ? req.query.day : DAYS[today];
            res.render("order", {today, day, base: "/order", active: "ticket", state: "normal"});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    CreateOrder = async (req, res) => {
        const client_id = req.user.id;
        const {date, barber_id} = req.body;
        try {
            const ticket = await this.#orderService.GetMyTicket(client_id);
            if (ticket) {
                throw new Error("tidak bisa booking 2 kali");
            }
            await this.#orderService.CreateOrder(new Date(date), client_id, parseInt(barber_id));
            res.redirect("/ticket");
        } catch (err) {
            res.redirect("back");
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
        res.render("login", {active: null, state: "auth"});
    }
    Register = async (req, res) => {
        res.render("register", {active: null, state: "auth"});
    }

    AuthLogin = async (req, res) => {
        const {email, password} = req.body;
        try {
            const token = await this.#authService.Auth(email, password).then(person => Sign(person));
            res.cookie("TOKEN", token).redirect("/");
        } catch (err) {
            res.redirect("back");
        }
    }

    AuthRegister = async (req, res) => {
        const {full_name, email, password, username, gender, address, phone} = req.body;
        try {
            const token = await this.#authService.Register(full_name, email, password, username, gender, address, phone)
                .then(person => Sign(person));
            res.cookie("TOKEN", token).redirect("/");
        } catch (err) {
            res.redirect("back");
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

    GetOrders = async (req, res) => {
        try {
            const id = req.query.id === "" ? undefined : req.query.id;
            const orders = await this.#orderService.GetForAdmin({id});
            res.render("components/orders", {orders, id});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    GetBanList = async (req, res) => {
        try {
            const email = req.query.email === "" ? undefined : req.query.email;
            const bans = await this.#authService.BanList(email);
            res.render("components/ban_list", {bans, email});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    OrderAccept = async (req, res) => {
        const {id} = req.params;
        try {
            await this.#orderService.UpdateState(parseInt(id), "ACCEPTED");
            return res.send("ACCEPTED");
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
            return res.send("EXPIRED");
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
            const bans = await this.#authService.BanList(email);
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
}

module.exports = Handler;