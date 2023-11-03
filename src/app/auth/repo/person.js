const db = require("../../../lib/db");
const Person = require("../../../domain/person");

class Repo {
    async Save(person) {
        if (typeof person.id === "undefined") {
            return db.Insert("Person", {
                name: person.name,
                email: person.email,
                password: person.password,
                role: person.role
            }).then(newPerson => new Person(newPerson));
        }
        await db.Update("Person", {
            name: person.name,
            email: person.email,
            password: person.password,
            role: person.role
        }, db.Where("id", person.id))
        return person;
    }

    async LoadOne({id, name, email}, op = "AND") {
        return db.QueryOne(`SELECT * FROM Person WHERE ${db.Wheres({
            id,
            name,
            email
        }, op)}`)
            .then(person => person ? new Person(person) : null);
    }

    async Load({id, name, email, banned}, op = "AND") {
        return db.Query(`SELECT * FROM Person WHERE ${db.Wheres({
            id,
            name,
            email
        }, op)}`)
            .then(persons => persons.map(person => new Person(person)));
    }
}

module.exports = Repo