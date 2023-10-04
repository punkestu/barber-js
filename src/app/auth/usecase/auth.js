const Validator = require("validatorjs");
const Person = require("../../../domain/person");

Validator.register("not_used", (_, requirement)=>{
    return !requirement;
},":attribute is used", null);
Validator.register("exists", (_, requirement)=>{
    return requirement;
}, ":attribute not exists", null);

class Auth {
    #repo;
    constructor(repo) {
        this.#repo = repo;
    }
    async Register(name, email, password){
        const validation = new Validator(
            {name, email},
            {
                name: [{"not_used": await this.#repo.LoadByName(name)}],
                email: [{"not_used": await this.#repo.LoadByEmail(email)}]
            }
        );
        if(!validation.check()){
            throw validation.errors;
        }
        const person = new Person({name,email,password,role:"client"});
        await person.EncryptPassword();
        return this.#repo.Save(person);
    }
    async Auth(email, password) {
        const validation = new Validator(
            {email},
            {
                email: [{"exists": await this.#repo.LoadByEmail(email)}]
            }
        );
        if(!validation.check()){
            throw validation.errors;
        }
        const person = await this.#repo.LoadByEmail(email);
        if(!(await person.VerifyPassword(password))){
            validation.errors.add("password", "password is wrong");
            throw validation.errors;
        }
        return person;
    }
}

module.exports = Auth;