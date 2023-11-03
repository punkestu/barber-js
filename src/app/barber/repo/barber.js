const db = require("../../../lib/db");
const BarberM = require("../../../domain/barber");
const {Schedules: SchedulesM, Schedule: ScheduleM} = require("../../../domain/schedule");
const PersonM = require("../../../domain/person");

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
    async Save(barber) {
        if (typeof barber.id === 'undefined') {
            return db.Insert("Barber", {
                barber_id: barber.barber_id,
                shift_id: barber.shift_id,
                active: barber.active
            }).then(newBarber => new BarberM(newBarber));
        }
        await db.Update("Barber", {
            barber_id: barber.barber_id,
            shift_id: barber.shift_id,
            active: barber.active
        }, db.Where("id", barber.id));
        return barber;
    }

    async LoadOne({id, shift_id, barber_id, active}, op = "AND") {
        return db.QueryOne(`SELECT b.*${", s.start"} FROM Barber b ${"JOIN Shift s ON (s.id=b.shift_id)"} WHERE ${db.Wheres({
            "b.id": id, shift_id, barber_id, active
        }, op)}`).then(barber => barber ? new BarberM({...barber, shift: {start: new Date(`2000-01-01T${barber.start}.000Z`)}}) : null);
    }

    async Load({id, shift_id, barber_id, active}, op = "AND") {
        return db.Query(`SELECT * FROM Barber WHERE ${db.Wheres({
            id, shift_id, barber_id, active
        }, op)}`).then(barbers => barbers.map(barber => new BarberM(barber)));
    }

    async LoadByBarber({day}) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return db.Query(`SELECT p.id as kapster_id, p.name, p.email, s.*, b.id as barber_id, b.active, ${"(o.id IS NOT NULL AND o.date >= ?)"} as ordered FROM Barber b ${"LEFT JOIN barber.`Order` o on b.id = o.barber_id"} ${"JOIN barber.Shift s on s.id = b.shift_id"} ${"JOIN Person p ON b.barber_id = p.id"} WHERE p.role=? AND s.day=?`, [today, "BARBER", day])
            .then(schedules => {
                return schedules.reduce(scheduleReducer, []).filter(s => s)
            });
    }

    async Delete(id) {
        return db.Delete("Barber", db.Where("id", id));
    }
}

module.exports = Barber;