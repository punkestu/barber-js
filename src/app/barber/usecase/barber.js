const BarberM = require("../../../domain/barber");
const Validator = require("validatorjs");

Validator.register("exists", (_, requirement) => {
    return requirement;
}, ":attribute not exists", null);

class Barber {
    #repo;
    #personRepo;
    #shiftRepo;

    constructor(repo, personRepo, shiftRepo) {
        this.#repo = repo;
        this.#personRepo = personRepo;
        this.#shiftRepo = shiftRepo;
    }

    async RegisterShift(barberId, shiftId) {
        const validation = new Validator(
            {barberId, shiftId},
            {
                barberId: [{"exists": (await this.#personRepo.LoadByID(barberId))}],
                shiftId: [{"exists": (await this.#shiftRepo.Load({id: barberId}))[0]}]
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#repo.Save(new BarberM({barber_id: barberId, shift_id: shiftId, active: true}));
    }

    async DropShift(id) {
        const validation = new Validator(
            {id},
            {
                id: [{"exists": (await this.#repo.Load({id}))[0]}],
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#repo.Delete(id);
    }

    async ToggleShift(id) {
        const barber = (await this.#repo.Load({id}))[0];
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