const Errors = require("validatorjs/src/errors");
const {Sign} = require("../../../../lib/jwt");
const Validator = require("validatorjs");

class Handler {
    #service;

    constructor(service) {
        this.#service = service;
    }

    Registration = async (req, res) => {
        const {name, email, password} = req.body;
        try {
            const validation = new Validator(
                {name, email, password},
                {
                    name: "required|string",
                    email: "required|email",
                    password: "required|string"
                }
            );
            if (!validation.check()) {
                throw validation.errors;
            }
            const person = await this.#service.Register(name, email, password);
            res.status(201).json({
                success: true,
                token: Sign({
                    id: person.id,
                    role: person.role
                })
            });
        } catch (err) {
            if (err instanceof Errors) {
                return res.status(400).json(err);
            }
            res.sendStatus(500);
        }
    }
    Authentication = async (req, res) => {
        const {email, password} = req.body;
        try {
            const validation = new Validator(
                {email, password},
                {
                    email: "required|email",
                    password: "required|string"
                }
            );
            if (!validation.check()) {
                throw validation.errors;
            }
            const person = await this.#service.Auth(email, password);
            res.status(200).json({
                success: true,
                token: Sign({
                    id: person.id,
                    role: person.role
                })
            });
        } catch (err) {
            if (err instanceof Errors) {
                return res.status(400).json(err);
            }
            res.sendStatus(500);
        }
    }
}

module.exports = Handler;