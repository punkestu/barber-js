const {person: db} = require("../../../lib/prisma");
const Person = require("../../../domain/person");
const Barber = require("../../../domain/barber");

function remap(data) {
    return {
        ...data,
        role: data.role.role
    }
}

class Repo {
    async Save(person) {
        person.role = {
            connectOrCreate: {
                where: {role: person.role},
                create: {role: person.role}
            }
        }
        let savedPerson;
        if (typeof person.id === "undefined") {
            savedPerson = await db.create({
                data: person,
                include: {
                    role: true
                }
            });
        }
        return new Person(remap(savedPerson));
    }

    async LoadOne({id, name, email}, op = null) {
        let person;
        if (op === "AND" || !op) {
            person = (await db.findFirst({
                where: {
                    AND: [{id}, {name}, {email}]
                }
            }));
        }else{
            person = (await db.findFirst({
                where: {
                    OR: [{id}, {name}, {email}]
                }
            }));
        }
        return person ? new Person(person) : null;
    }
    async Load({id, name, email}, op = null) {
        if (op === "AND" || !op) {
            return (await db.findMany({
                where: {
                    AND: [{id}, {name}, {email}]
                }
            })).map(person => new Person(person));
        }
        return (await db.findMany({
            where: {
                OR: [{id}, {name}, {email}]
            }
        })).map(person => new Person(person));
    }
}

module.exports = Repo