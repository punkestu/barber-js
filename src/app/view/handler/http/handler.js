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
            const barbers = await this.#service.GetSchedule(day);
            res.render("index", {barbers, today, day, base: "", active: "home", cursor: null});
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
            res.render("order", {today, day, base: "/order", active: "ticket"});
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    CreateOrder = async (req, res) => {
        const client_id = req.user.id;
        const {date, barber_id} = req.body;
        console.log(client_id, date, barber_id);
        try {
            console.log(date, client_id, barber_id);
            const ticket = await this.#orderService.GetMyTicket(client_id);
            if (ticket) {
                throw new Error("tidak bisa booking 2 kali");
            }
            await this.#orderService.CreateOrder(new Date(date), client_id, parseInt(barber_id));
            res.redirect("/ticket");
        } catch (err) {
            console.log(err);
            res.redirect("back");
        }
    }

    Ticket = async (req, res) => {
        const client_id = req.user.id;
        const ticket = await this.#orderService.GetMyTicket(client_id);
        console.log(ticket);
        if (ticket) {
            res.render("ticket", {ticket, active: "ticket"});
        } else {
            res.redirect("/order");
        }
    }

    Login = async (req, res) => {
        res.render("login", {active: null});
    }
    Register = async (req, res) => {
        res.render("register", {active: null});
    }

    AuthLogin = async (req, res) => {
        console.log(req.body);
        const {email, password} = req.body;
        try {
            const token = await this.#authService.Auth(email, password).then(person => Sign(person));
            res.cookie("TOKEN", token).redirect("/");
        } catch (err) {
            console.log(err);
            res.redirect("back");
        }
    }

    AuthRegister = async (req, res) => {
        const {full_name, email, password} = req.body;
        try {
            const token = await this.#authService.Register(full_name, email, password).then(person => Sign(person));
            res.cookie("TOKEN", token).redirect("/");
        } catch (err) {
            console.log(err);
            res.redirect("back");
        }
    }

    Profile = async (req, res) => {
        res.render("profile", {user: req.user, active: "profile"});
    }

    BanScreen = (req, res) => {
        res.render("ban-screen", {active: null});
    }

    // TODO refactor admin view
    AdminOrder = async (req, res) => {
        try {
            const orders = await this.#orderService.GetForAdmin();
            res.render("admin", {orders});
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    GetOrders = async (req, res) => {
        try {
            const orders = await this.#orderService.GetForAdmin();
            res.render("components/orders", {orders});
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
            console.log(err);
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
            console.log(err);
            return res.sendStatus(400);
        }
    }

    // TODO delete all GetSchedule except this
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