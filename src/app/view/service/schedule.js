const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
class Schedule {
    #repo;
    constructor(repo) {
        this.#repo = repo;
    }
    async GetSchedule(day) {
        console.log("day", day);
        return this.#repo.LoadByBarber({day});
    }
}

module.exports = Schedule;