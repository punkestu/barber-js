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
        const today = new Date().getDay();
        const day = req.query.day ? req.query.day : DAYS[today];
        console.log(req.query);
        try {
            const barbers = await this.#service.GetSchedule(day);
            res.render("index", {barbers, today, day, base: "", active: "home"});
        } catch (err) {
            res.sendStatus(500);
        }
    }

    Order = async (req, res) => {
        try {
            const today = new Date().getDay();
            const day = req.query.day ? req.query.day : DAYS[today];
            const client_id = req.user.id;
            const ticket = await this.#orderService.GetMyTicket(client_id);
            if (ticket) {
                return res.redirect("/ticket");
            }
            const barbers = await this.#service.GetSchedule(day);
            res.render("order", {barbers, today, day, base: "/order", active: "ticket"});
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    CreateOrder = async (req, res) => {
        const client_id = req.user.id;
        const {date, barber_id} = req.body;
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

    AdminOrder = async (req, res) => {
        try {
            const orders = await this.#orderService.GetForAdmin();
            res.render("admin", {orders});
        } catch (err) {
            console.log(err);
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
            await this.#orderService.UpdateState(parseInt(id), "EXPIRED");
            return res.send("EXPIRED");
        } catch (err) {
            console.log(err);
            return res.sendStatus(400);
        }
    }

    GetSchedule = async (req, res) => {
        try {
            const day = req.query["schedule-day"] ? DAYS[parseInt(req.query["schedule-day"])] : DAYS[new Date().getDay()];
            const barbers = await this.#service.GetSchedule(day);
            res.render("components/schedule_list", {barbers, day});
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

module.exports = Handler;