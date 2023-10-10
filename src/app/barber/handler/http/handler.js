const Validator = require("../../../../lib/validator");
const Errors = require("validatorjs/src/errors");

class Handler {
    #service;

    constructor(service) {
        this.#service = service;
    }

    RegisterShift = async (req, res) => {
        const {barber_id, shift_id} = req.body;
        try {
            const validation = new Validator(
                {barber_id, shift_id},
                {
                    barber_id: "required|isInteger",
                    shift_id: "required|isInteger"
                }
            );
            if (!validation.check()) {
                throw validation.errors;
            }
            const barber = await this.#service.RegisterShift(barber_id, shift_id);
            res.status(201).json(barber);
        } catch (err) {
            if (err instanceof Errors) {
                return res.status(400).json(err);
            }
            res.sendStatus(500);
        }
    }

    DropShift = async (req, res) => {
        const {id} = req.body;
        try {
            const validation = new Validator(
                {id},
                {
                    id: "required|isInteger"
                }
            );
            if (!validation.check()) {
                throw validation.errors;
            }
            const barber = await this.#service.DropShift(id);
            return res.json(barber);
        } catch (err) {
            if (err instanceof Errors) {
                return res.status(400).json(err);
            }
            return res.sendStatus(500);
        }
    }

    ToggleShift = async (req, res) => {
        const {id} = req.body;
        try {
            const validation = new Validator(
                {id},
                {
                    id: "required|isInteger"
                }
            );
            if (!validation.check()) {
                throw validation.errors;
            }
            const barber = await this.#service.ToggleShift(id);
            return res.json(barber);
        } catch (err) {
            if (err instanceof Errors) {
                return res.status(400).json(err);
            }
            return res.sendStatus(500);
        }
    }

    GetAll = async (req, res) => {
        const {day} = req.query;
        try {
            const schedules = await this.#service.GetSchedule({day});
            res.json(schedules);
        } catch (err) {
            res.json(err);
        }
    }
}

module.exports = Handler;