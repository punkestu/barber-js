const db = require("../../../lib/db");
const BarberM = require("../../../domain/barber");
const {Schedules: SchedulesM, Schedule: ScheduleM} = require("../../../domain/schedule");
const PersonM = require("../../../domain/person");
const {DAYS} = require("../../../lib/statics");

function scheduleReducer(barbers, schedule) {
    if (!barbers[schedule.kapster_id]) {
        barbers[schedule.kapster_id] = new SchedulesM({
            barber: new PersonM({
                name: schedule.name,
                email: schedule.email
            }),
            schedules: [new ScheduleM({
                id: schedule.barber_id,
                start: schedule.start,
                end: schedule.end,
                day: schedule.day,
                barber_id: schedule.barber_id,
                active: schedule.active,
                ordered: schedule.ordered
            })]
        });
    } else {
        barbers[schedule.kapster_id].schedules.push(
            new ScheduleM({
                id: schedule.barber_id,
                start: schedule.start,
                end: schedule.end,
                day: schedule.day,
                barber_id: schedule.barber_id,
                active: schedule.active,
                ordered: schedule.ordered
            })
        );
    }
    return barbers;
}

class Barber {
    #cacheMem = {
        LoadByBarber: {}
    };

    constructor() {
        this.CacheLoadByBarber({}).then(()=>{
            setInterval(async ()=>{
                await this.CacheLoadByBarber({});
            }, 30 * 60 * 1000);
        });
    }

    async Save(barber) {
        try {
            if (typeof barber.id === 'undefined') {
                const savedBarber = await db.Insert("Barber", {
                    barber_id: barber.barber_id,
                    shift_id: barber.shift_id,
                    active: barber.active
                }).then(newBarber => new BarberM(newBarber));
                db.QueryOne("SELECT day FROM Shift WHERE id=?", [savedBarber.shift_id])
                    .then(shift => {
                        this.CacheLoadByBarber({day: shift.day}).then();
                    })
                return savedBarber;
            }
            await db.Update("Barber", {
                barber_id: barber.barber_id,
                shift_id: barber.shift_id,
                active: barber.active
            }, db.Where("id", barber.id))
            db.QueryOne("SELECT day FROM Shift WHERE id=?", [barber.shift_id])
                .then(shift => {
                    this.CacheLoadByBarber({day: shift.day}).then();
                })
            return barber;
        } catch (err) {
            throw err;
        }
    }

    async LoadOne({id, shift_id, barber_id, active}, op = "AND") {
        return db.QueryOne(`SELECT ${"b.*, s.start, s.day"} ${"FROM Barber b"} ${"JOIN Shift s ON (s.id=b.shift_id)"} WHERE ${db.Wheres({
            "b.id": id, shift_id, barber_id, active
        }, op)}`).then(barber => barber ? new BarberM({
            ...barber,
            shift: {start: new Date(`2000-01-01T${barber.start}.000Z`), day: barber.day}
        }) : null);
    }

    async Load({id, shift_id, barber_id, active}, op = "AND") {
        return db.Query(`SELECT * FROM Barber WHERE ${db.Wheres({
            id, shift_id, barber_id, active
        }, op)}`).then(barbers => barbers.map(barber => new BarberM(barber)));
    }

    async LoadByBarber({day}) {
        return day ? this.#cacheMem.LoadByBarber[day] : this.#cacheMem.LoadByBarber;
    }

    async CacheLoadByBarber({day}) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (day) {
            this.#cacheMem.LoadByBarber[day] = await db.Query(`SELECT p.id as kapster_id, p.name, p.email, s.*, b.id as barber_id, b.active, ${"(o.id IS NOT NULL AND o.date >= ?)"} as ordered FROM Barber b ${"LEFT JOIN `Order` o on b.id = o.barber_id"} ${"JOIN Shift s on s.id = b.shift_id"} ${"JOIN Person p ON b.barber_id = p.id"} WHERE p.role=? AND s.day=? ORDER BY s.start`, [today, "BARBER", day])
                .then(schedules => {
                    return schedules.reduce(scheduleReducer, []).filter(s => s)
                });
            return true;
        }
        for (const _day of DAYS) {
            this.#cacheMem.LoadByBarber[_day] = await db.Query(`SELECT p.id as kapster_id, p.name, p.email, s.*, b.id as barber_id, b.active, ${"(o.id IS NOT NULL AND o.date >= ?)"} as ordered FROM Barber b ${"LEFT JOIN `Order` o on b.id = o.barber_id"} ${"JOIN Shift s on s.id = b.shift_id"} ${"JOIN Person p ON b.barber_id = p.id"} WHERE p.role=? AND s.day=? ORDER BY s.start`, [today, "BARBER", _day])
                .then(schedules => {
                    return schedules.reduce(scheduleReducer, []).filter(s => s)
                });
        }
    }

    async Delete(id) {
        return db.Delete("Barber", db.Where("id", id)).then(async () => {
            await this.CacheLoadByBarber({});
        });
    }
}

module.exports = Barber;