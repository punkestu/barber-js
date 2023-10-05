const Shift = require("../../../domain/shift");
const Validator = require("validatorjs");
const {ErrNotFound} = require("../../../domain/error");

Validator.register("not_used", (_, requirement) => {
    return !requirement;
}, ":attribute is used", null);
Validator.register("exists", (_, requirement) => {
    return requirement;
}, ":attribute not exists", null);
Validator.register("after_time", (value, requirement) => {
    return (value - requirement) > 0;
}, ":attribute must after requirement", null);

class Service {
    #repo;

    constructor(repo) {
        this.#repo = repo;
    }

    async CreateShift(start, end, day) {
        const validation = new Validator(
            {start, end},
            {
                start: [{"not_used": (await this.#repo.IsConflict({start, end, day}))[0]}],
                end: [{"after_time": start}]
            },
            {"not_used": "this schedule is used", "after_time": ":attribute must after start"}
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#repo.Save(new Shift({start, end, day}));
    }

    async DeleteShift(id) {
        if(!(await this.#repo.Load({id}))[0]){
            throw new ErrNotFound(`shift with id ${id}`);
        }
        return this.#repo.Delete(id);
    }

    async UpdateShift(id, start, end, day) {
        const validation = new Validator(
            {id, start, end},
            {
                id: [{"exists": (await this.#repo.Load({id}))[0]}],
                start: [{"not_used": (await this.#repo.IsConflict({start, end, day}))[0]}],
                end: [{"after_time": start}]
            },
            {"not_used": "this schedule is used", "after_time": ":attribute must after start"}
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#repo.Save(new Shift({id, start, end, day}));
    }
}

module.exports = Service;