const {barber: db} = require("../../../lib/prisma");
const Barber = require("../../../domain/barber");

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

    async Load({id, shift_id, barber_id, active}, op) {
        if (op === "AND" || !op) {
            return (await db.findMany({
                where: {
                    AND: [{id}, {shift_id}, {barber_id}, {active}]
                }
            })).map(barber=>new Barber(barber));
        }
        return (await db.findMany({
            where: {
                OR: [{id}, {shift_id}, {barber_id}, {active}]
            }
        })).map(barber=>new Barber(barber));
    }

    async Delete(id){
        return db.delete({
            where: {id}
        });
    }
}

module.exports = Repo;