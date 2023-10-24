const Prisma = require("../../../lib/prisma");
const Shift = require("../../../domain/shift");
const {shift: db} = require("../../../lib/prisma");

class Repo {
    async Save(shift) {
        let savedShift;
        if (typeof shift.id === 'undefined') {
            savedShift = await Prisma.shift.create({
                data: shift
            });
        } else {
            savedShift = await Prisma.shift.update({
                data: {
                    ...shift,
                    id: undefined
                },
                where: {id: shift.id}
            });
        }
        return new Shift(savedShift);
    }

    async LoadOne({id, start, day}, op = null){
        let shift;
        if (op === "AND" || !op) {
            shift = await db.findFirst({
                where: {
                    AND: [{id}, {start}, {day}]
                }
            });
        } else {
            shift = await db.findFirst({
                where: {
                    OR: [{id}, {start}, {day}]
                }
            });
        }
        return shift ? new Shift(shift) : null;
    }

    async Load({id, start, day}, op = null) {
        if (op === 'AND' || op === null) {
            return (await Prisma.shift.findMany({
                where: {AND: [{id}, {start}, {day}]}
            })).map(shift => new Shift(shift));
        } else if (op === 'OR') {
            return (await Prisma.shift.findMany({
                where: {OR: [{id}, {start}, {day}]}
            })).map(shift => new Shift(shift));
        }
    }

    async IsConflict({id, start, end, day}) {
        if (id) {
            return (await Prisma.$queryRaw`SELECT * FROM Shift WHERE day=${day} 
            AND id!=${id}
            AND (${start} < end AND ${end} > start)`)[0];
        }
        return (await Prisma.$queryRaw`SELECT * FROM Shift WHERE day=${day} 
            AND (${start} < end AND ${end} > start)`)[0];
    }

    async Delete(id) {
        return Prisma.shift.delete({
            where: {id}
        });
    }
}

module.exports = Repo;