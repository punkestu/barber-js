const Validator = require("../../../lib/validator");
const Person = require("../../../domain/person");

class Auth {
    #personRepo;

    constructor(personRepo) {
        this.#personRepo = personRepo;
    }

    async Register(name, email, password) {
        const validation = new Validator(
            {name, email},
            {
                name: [{"not_used": (await this.#personRepo.LoadOne({name}))}],
                email: [{"not_used": (await this.#personRepo.LoadOne({email}))}]
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        const person = new Person({name, email, password, role: "CLIENT"});
        await person.EncryptPassword();
        return this.#personRepo.Save(person);
    }

    async Auth(email, password) {
        const person = await this.#personRepo.LoadOne({email});
        const validation = new Validator(
            {email},
            {
                email: [{"exists": person}]
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        if (!(await person.VerifyPassword(password))) {
            validation.errors.add("password", "password is wrong");
            throw validation.errors;
        }
        return person;
    }

    async ToggleBan(id) {
        const person = await this.#personRepo.LoadOne({id});
        person.banned = !person.banned;
        return await this.#personRepo.Save(person);
    }
}

module.exports = Auth;