const Validator = require("../../../../lib/validator");
const Errors = require("validatorjs/src/errors");
const {ErrNotFound} = require("../../../../domain/error");

function toTime(time) {
    return new Date("1970-01-01T" + time);
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

class Handler {
    #service;

    constructor(service) {
        this.#service = service;
    }

    CreateShift = async (req, res) => {
        const {start, end, day} = req.body;
        try {
            const validation = new Validator(
                {start, end, day},
                {
                    start: "required|string|regex:/[0-9]{2}:[0-9]{2}/",
                    end: "required|string|regex:/[0-9]{2}:[0-9]{2}/",
                    day: ["required", "string", {"in": DAYS}]
                }
            );
            if(!validation.check()){
                throw validation.errors;
            }
            const shift = await this.#service.CreateShift(
                toTime(start),
                toTime(end),
                day
            );
            res.status(201).json(shift);
        } catch (err) {
            if(err instanceof Errors){
                return res.status(400).json(err);
            }
            console.log(err);
            res.sendStatus(500);
        }
    }
    UpdateShift = async (req, res) => {
        const {id, start, end, day} = req.body;
        try {
            const validation = new Validator(
                {id, start, end, day},
                {
                    id: "required|integer",
                    start: "required|string|regex:/[0-9]{2}:[0-9]{2}/",
                    end: "required|string|regex:/[0-9]{2}:[0-9]{2}/",
                    day: ["required", "string", {"in": DAYS}]
                }
            );
            if(!validation.check()){
                throw validation.errors;
            }
            const shift = await this.#service.UpdateShift(
                id,
                toTime(start),
                toTime(end),
                day
            );
            res.json(shift);
        } catch (err) {
            if(err instanceof Errors){
                return res.status(400).json(err);
            }
            console.log(err);
            res.sendStatus(500);
        }
    }
    DeleteShift = async (req, res) => {
        const {id} = req.body;
        try {
            const shift = await this.#service.DeleteShift(id);
            res.json(shift);
        } catch (err) {
            if(err instanceof ErrNotFound){
                return res.status(404).json({
                    errors: {
                        message: err.message
                    }
                })
            }
            res.sendStatus(500);
        }
    }
}

module.exports = Handler;