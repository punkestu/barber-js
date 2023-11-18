class Schedules {
    barber;
    schedules;
    constructor({barber, schedules}) {
        this.barber = barber;
        this.schedules = schedules;
    }
}

class Schedule {
    id;
    start;
    end;
    day;
    barber_id;
    active;
    ordered;
    constructor({id, start, end, day, barber_id, active, ordered}) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.day = day;
        this.barber_id = barber_id;
        this.active = active;
        this.ordered = ordered;
    }
}

module.exports = {Schedules, Schedule};