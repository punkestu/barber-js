const {barber: db, person: db2} = require("../../../lib/prisma");
const Barber = require("../../../domain/barber");
const Schedule = require("../../../domain/schedule");

class Repo {
    async Save(barber) {
        let savedBarber;
        if (!barber.id) {
            savedBarber = await db.create({
                data: {
                    barber_id: barber.barber_id,
                    shift_id: barber.shift_id,
                    active: barber.active
                }
            });
            return new Barber(savedBarber);
        }
        savedBarber = await db.update({
            data: {
                barber_id: barber.barber_id,
                shift_id: barber.shift_id,
                active: barber.active
            },
            where: {
                id: barber.id
            }
        });
        return new Barber(savedBarber);
    }

    async LoadOne({id, shift_id, barber_id, active}, op = null) {
        let barber;
        if (op === "AND" || !op) {
            barber = await db.findFirst({
                where: {
                    AND: [{id}, {shift_id}, {barber_id}, {active}]
                }
            });
        } else {
            barber = await db.findFirst({
                where: {
                    OR: [{id}, {shift_id}, {barber_id}, {active}]
                }
            });
        }
        return barber ? new Barber(barber) : null;
    }

    async Load({id, shift_id, barber_id, active}, op = null) {
        if (op === "AND" || !op) {
            return (await db.findMany({
                where: {
                    AND: [{id}, {shift_id}, {barber_id}, {active}]
                }
            })).map(barber => new Barber(barber));
        }
        return (await db.findMany({
            where: {
                OR: [{id}, {shift_id}, {barber_id}, {active}]
            }
        })).map(barber => new Barber(barber));
    }

    async LoadByBarber({day}) {
        const today = new Date();
        today.setHours(0,0,0,0);
        return db2.findMany({
            where: {
                role: "BARBER",
            },
            select: {
                name: true,
                email: true,
                Barber: {
                    where: {shift: {day:day}},
                    select: {
                        id: true, active: true, shift: true, Order: {
                            where: {
                                date: {gte: today}
                            }
                        }
                    }
                }
            }
        }).then(barbers => {
            return barbers.map(barber =>
                new Schedule({
                    barber: {...barber, Barber: undefined},
                    schedules: barber.Barber
                }));
        });
    }

    async Delete(id) {
        return db.delete({
            where: {id}
        });
    }
}

module.exports = Repo;