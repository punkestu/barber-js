class Schedule {
    #repo;
    constructor(repo) {
        this.#repo = repo;
    }
    async GetSchedule(day) {
        return this.#repo.LoadByBarber({day});
    }
}

module.exports = Schedule;