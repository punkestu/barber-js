const {person: db} = require("../../../lib/prisma");
const Person = require("../../../domain/person");

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
    async LoadByID(id){
        const person = await db.findFirst({
            where: {id},
            include: {role: true}
        });
        return new Person(remap(person));
    }
    async LoadByName(name) {
        const person = await db.findFirst({
            where: {name},
            include: {role: true}
        });
        return person ? new Person(remap(person)) : null;
    }
    async LoadByEmail(email) {
        const person = await db.findFirst({
            where: {email},
            include: {role: true}
        });
        return person ? new Person(remap(person)) : null;
    }
}

module.exports = Repo