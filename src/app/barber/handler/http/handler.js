const Validator = require("validatorjs");
const Errors = require("validatorjs/src/errors");

Validator.register("isInteger", (value) => {
    return typeof value === 'number';
}, ":attribute must be integer", null);

class Handler {
    #service;

    constructor(service) {
        this.#service = service;
    }

    RegisterShift = async (req, res) => {
        const {barberId, shiftId} = req.body;
        try {
            const validation = new Validator(
                {barberId, shiftId},
                {
                    barberId: "required|isInteger",
                    shiftId: "required|isInteger"
                }
            );
            if (!validation.check()) {
                throw validation.errors;
            }
            const barber = await this.#service.RegisterShift(barberId, shiftId);
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
}

module.exports = Handler;