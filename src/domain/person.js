const {Model} = require("./model");
const {Hash, Verify} = require("../lib/crypto");

class Person extends Model{
    name;
    email;
    password;
    role;
    constructor({id,name,email,password,role}) {
        super(id);
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    async EncryptPassword(){
        this.password = await Hash(this.password);
    }
    async VerifyPassword(password){
        return Verify(password, this.password);
    }
}

module.exports = Person;