const {Person} = require("../src/domain/person");
const prisma = require("../src/lib/prisma");
const repo = new (require("../src/app/auth/repo/person"))(prisma);

// const person = new Person({name: "bima", email: "bima", password: "bima", role: "client"});
// repo.Save(person).then(res=>console.log(res));
repo.LoadByID(4).then(res=>console.log(res));