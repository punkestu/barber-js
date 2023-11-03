require("./src/lib/db").Init("mysql://bima:@localhost:3306/barber");
require("./bin/express");
const db = require("./src/lib/db");
