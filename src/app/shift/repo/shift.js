const Prisma = require("../../../lib/prisma");
const Shift = require("../../../domain/shift");

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

    async Load({id, start, day}, op = null) {
        let shifts;
        if (op === 'AND' || op === null) {
            shifts = (await Prisma.shift.findMany({
                where: {AND: [{id}, {start}, {day}]}
            })).map(shift => new Shift(shift));
        } else if (op === 'OR') {
            shifts = (await Prisma.shift.findMany({
                where: {OR: [{id}, {start}, {day}]}
            })).map(shift => new Shift(shift));
        }
        return shifts;
    }

    async IsConflict({id, start, end, day}) {
        if (id) {
            return Prisma.$queryRaw`SELECT * FROM Shift WHERE day=${day} 
            AND id=${id}
            AND (${start} < end AND ${end} > start)`;
        }
        return Prisma.$queryRaw`SELECT * FROM Shift WHERE day=${day} 
            AND (${start} < end AND ${end} > start)`;
    }

    async Delete(id) {
        return Prisma.shift.delete({
            where: {id}
        });
    }
}

module.exports = Repo;