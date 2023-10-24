const BarberM = require("../../../domain/barber");
const Validator = require("../../../lib/validator");

class Barber {
    #repo;
    #personRepo;
    #shiftRepo;

    constructor(repo, personRepo, shiftRepo) {
        this.#repo = repo;
        this.#personRepo = personRepo;
        this.#shiftRepo = shiftRepo;
    }

    async RegisterShift(barber_id, shift_id) {
        const validation = new Validator(
            {barber_id, shift_id},
            {
                barber_id: [{"exists": await this.#personRepo.LoadOne({id: barber_id})}],
                shift_id: [{"exists": await this.#shiftRepo.LoadOne({id: shift_id})}]
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#repo.Save(new BarberM({barber_id: barber_id, shift_id: shift_id, active: true}));
    }

    async DropShift(id) {
        const validation = new Validator(
            {id},
            {
                id: [{"exists": await this.#repo.LoadOne({id})}],
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#repo.Delete(id);
    }

    async ToggleShift(id) {
        const barber = (await this.#repo.LoadOne({id}));
        const validation = new Validator(
            {id},
            {
                id: [{"exists": barber}],
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        barber.active = !barber.active;
        return this.#repo.Save(barber);
    }
}

module.exports = Barber;