const Barber = require("../../../domain/barber");

class Schedule {
    #barberRepo;

    constructor(barberRepo) {
        this.#barberRepo = barberRepo;
    }

    async GetSchedule(day) {
        return this.#barberRepo.LoadByBarber({day});
    }

    async SyncSchedule() {
        await this.#barberRepo.CacheLoadByBarber({});
    }

    async CreateSchedule(shift_id) {
        const barbers = await this.#barberRepo.LoadBarbers();
        for (const barber of barbers) {
            await this.#barberRepo.Save(new Barber({
                active: 1,
                shift_id,
                barber_id: barber.id
            }));
        }
    }
}

module.exports = Schedule;