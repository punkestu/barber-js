class Schedule {
    #barberRepo;
    constructor(barberRepo) {
        this.#barberRepo = barberRepo;
    }
    async GetSchedule(day) {
        return this.#barberRepo.LoadByBarber({day});
    }
}

module.exports = Schedule;