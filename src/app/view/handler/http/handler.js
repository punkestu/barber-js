const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
class Handler {
    #service;

    constructor(service) {
        this.#service = service;
    }

    Index = async (req,res) => {
        const today = new Date().getDay();
        const day = req.query.day ? req.query.day : DAYS[new Date().getDay()];
        console.log(req.query);
        try {
            const barbers = await this.#service.GetSchedule(day);
            res.render("index", {barbers, today, day});
        } catch (err) {
            res.sendStatus(500);
        }
    }
    GetSchedule = async (req, res) => {
        const {day} = req.query;
        try {
            const barbers = await this.#service.GetSchedule({day});
            res.render("components/schedule_list", {barbers});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = Handler;