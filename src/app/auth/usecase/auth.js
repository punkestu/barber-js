const Validator = require("../../../lib/validator");
const Person = require("../../../domain/person");

class Auth {
    #repo;
    constructor(repo) {
        this.#repo = repo;
    }
    async Register(name, email, password){
        const validation = new Validator(
            {name, email},
            {
                name: [{"not_used": (await this.#repo.LoadOne({name}))}],
                email: [{"not_used": (await this.#repo.LoadOne({email}))}]
            }
        );
        if(!validation.check()){
            console.log(validation.errors);
            throw validation.errors;
        }
        const person = new Person({name,email,password,role:"CLIENT"});
        await person.EncryptPassword();
        return this.#repo.Save(person);
    }
    async Auth(email, password) {
        const person = await this.#repo.LoadOne({email});
        const validation = new Validator(
            {email},
            {
                email: [{"exists": person}]
            }
        );
        if(!validation.check()){
            throw validation.errors;
        }
        if(!(await person.VerifyPassword(password))){
            validation.errors.add("password", "password is wrong");
            throw validation.errors;
        }
        return person;
    }
}

module.exports = Auth;