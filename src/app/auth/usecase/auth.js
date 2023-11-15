const Validator = require("../../../lib/validator");
const Person = require("../../../domain/person");

class Auth {
    #personRepo;

    constructor(personRepo) {
        this.#personRepo = personRepo;
    }

    async Register(name, email, password, username, gender, alamat, nohp) {
        const validation = new Validator(
            {email},
            {
                email: [{"not_used": (await this.#personRepo.LoadOne({email}))}]
            }
        );
        if (!validation.check()) {
            throw validation.errors;
        }
        const person = new Person({name, email, password, role: "CLIENT", username, gender, alamat, nohp});
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
        const toggled = await this.#personRepo.Save(person);
        this.#personRepo.CacheLoadBanned().then();
        return toggled;
    }

    async BanList({page, email}) {
        return await this.#personRepo.LoadBanned({email, start: page * 10, limit: 10});
    }
}

module.exports = Auth;