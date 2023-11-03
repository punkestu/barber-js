const {person: db} = require("../../../lib/prisma");
const Person = require("../../../domain/person");

class Repo {
    async Save(person) {
        let savedPerson;
        if (typeof person.id === "undefined") {
            savedPerson = await db.create({
                data: person,
            });
        } else {
            savedPerson = await db.update({
                where: {id: person.id},
                data: person
            });
        }
        return new Person(savedPerson);
    }

    async LoadOne({id, name, email}, op = null) {
        let person;
        if (op === "AND" || !op) {
            person = (await db.findFirst({
                where: {
                    AND: [{id}, {name}, {email}]
                }
            }));
        } else {
            person = (await db.findFirst({
                where: {
                    OR: [{id}, {name}, {email}]
                }
            }));
        }
        return person ? new Person(person) : null;
    }

    async Load({id, name, email, banned}, op = null) {
        if (op === "AND" || !op) {
            return (await db.findMany({
                where: {
                    AND: [{id}, {name}, {email}, {banned}]
                }
            })).map(person => new Person(person));
        }
        return (await db.findMany({
            where: {
                OR: [{id}, {name}, {email}, {banned}]
            }
        })).map(person => new Person(person));
    }
}

module.exports = Repo