const db = require("../../../lib/db");
const Person = require("../../../domain/person");

class Repo {
    #cacheMem = {};

    constructor() {
        this.CacheLoadBanned().then();
    }

    async Save(person) {
        if (typeof person.id === "undefined") {
            return db.Insert("Person", {
                name: person.name,
                email: person.email,
                password: person.password,
                role: person.role
            }).then(newPerson => db.Insert("PersonInfo", {
                    person_id: newPerson.id,
                    username: person.username,
                    gender: person.gender,
                    alamat: person.alamat,
                    nohp: person.nohp,
                }).then(personInfo => new Person({...personInfo, ...newPerson}))
            );
        }
        await db.Update("Person", {
            name: person.name,
            email: person.email,
            password: person.password,
            role: person.role,
            banned: person.banned
        }, db.Where("id", person.id));
        await db.Update("PersonInfo", {
            username: person.username,
            gender: person.gender,
            alamat: person.alamat,
            nohp: person.nohp,
        }, db.Where("person_id", person.id));
        return person;
    }

    async LoadOne({id, name, email, role, banned}, op = "AND") {
        return db.QueryOne(`SELECT pi.*, p.* FROM Person p LEFT JOIN PersonInfo pi ON (p.id=pi.person_id) ${db.UseWhere({
            id, name, email, role, banned
        })} ${db.Wheres({
            "p.id": id,
            name,
            email,
            role,
            banned
        }, op)}`)
            .then(person => person ? new Person(person) : null);
    }

    async Load({id, name, email, role, banned}, {start, limit}, op = "AND") {
        return db.Query(`SELECT pi.*, p.* FROM Person p LEFT JOIN PersonInfo pi ON (p.id=pi.person_id) ${db.UseWhere({
            id, name, email, role, banned
        })} ${db.Wheres({
            "p.id": id,
            name,
            email,
            role,
            banned
        }, op)} ${typeof limit !== 'undefined' ? "LIMIT ?" : ""} ${typeof start !== 'undefined' ? "OFFSET ?" : ""}`, [limit, start].filter(c => typeof c !== 'undefined'))
            .then(persons => persons.map(person => new Person(person)));
    }

    async LoadBanned({email, start, limit}) {
        if (typeof email !== 'undefined') {
            return this.#cacheMem.LoadBanned.filter(c => c.email.includes(email));
        }
        return this.#cacheMem.LoadBanned.slice(start, limit);
    }

    async CacheLoadBanned() {
        this.#cacheMem.LoadBanned = await this.Load({banned: true}, {});
    }
}

module.exports = Repo