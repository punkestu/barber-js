const express = require("express");
const app = express();

app.use(express.json());

const auth = require("../src/app/auth")();
const authMid = require("../src/middleware/auth")(auth.repo);
const shift = require("../src/app/shift")(authMid);
const barber = require("../src/app/barber")(auth.repo, shift.repo, authMid);

app.use("/person", auth.http);
app.use("/shift", shift.http);
app.use("/barber", barber.http);

app.listen(3000, ()=>console.log("listen at :3000"));