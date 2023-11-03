const db = require("../../../lib/db");
const ShiftM = require("../../../domain/shift");

class Shift {
    async Save(shift) {
        if (typeof shift.id === 'undefined') {
            return db.Insert("Shift", {
                start: shift.start,
                end: shift.end,
                day: shift.day
            }).then(newShift => new ShiftM(newShift));
        }
        await db.Update("Shift", {
            start: shift.start,
            end: shift.end,
            day: shift.day
        }, db.Where("id", shift.id));
        return shift;
    }

    async LoadOne({id, start, day}, op = "AND") {
        return db.QueryOne(`SELECT * FROM Shift WHERE ${db.Wheres({
            id, start, day
        }, op)}`, [id, start, day])
            .then(shift => new ShiftM(shift));
    }

    async Load({id, start, day}, op = null) {
        return db.Query(`SELECT * FROM Shift WHERE ${db.Wheres({
            id, start, day
        }, op)}`, [id, start, day])
            .then(shifts => shifts.map(shift => new ShiftM(shift)));
    }

    async IsConflict({id, start, end, day}) {
        if (typeof id === 'undefined') {
            return db.QueryOne(`SELECT * FROM Shift WHERE day=? AND id!=? AND (? < end AND ? > ${"start"})`, [day, id, end, start])
                .then(shift => new ShiftM(shift));
        }
        return db.QueryOne(`SELECT * FROM Shift WHERE day=? AND (? < end AND ? > ${"start"})`, [day, id, end, start])
            .then(shift => new ShiftM(shift));
    }

    async Delete(id) {
        return db.Delete("Shift", db.Where("id", id));
    }
}

module.exports = Shift;