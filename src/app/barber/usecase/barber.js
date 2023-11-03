const BarberM = require("../../../domain/barber");
const Validator = require("../../../lib/validator");

class Barber {
    #barberRepo;
    #personRepo;
    #shiftRepo;

    constructor(barberRepo, personRepo, shiftRepo) {
        this.#barberRepo = barberRepo;
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
        return this.#barberRepo.Save(new BarberM({barber_id: barber_id, shift_id: shift_id, active: true}));
    }

    async DropShift(id) {
        const validation = new Validator(
            {id},
            {
                id: [{"exists": await this.#barberRepo.LoadOne({id})}],
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        return this.#barberRepo.Delete(id);
    }

    async ToggleShift(id) {
        const barber = (await this.#barberRepo.LoadOne({id}));
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
        return this.#barberRepo.Save(barber);
    }
}

module.exports = Barber;