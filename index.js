require("dotenv").config();
require("./src/lib/db").Init({
    host     : 'localhost',
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});
require("./bin/express");
