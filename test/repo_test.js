require("dotenv").config();
const db = require("../src/lib/db");
db.Init({
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

const userRepo = new (require("../src/app/auth/repo/person"))();

userRepo.Load({}, {start: 1, limit: 1}).then(res=>console.log(res));