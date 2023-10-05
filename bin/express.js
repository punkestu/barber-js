const express = require("express");
const app = express();

app.use(express.json());

const auth = require("../src/app/auth")();
const shift = require("../src/app/shift")();

app.use("/person", auth.http);
app.use("/shift", shift.http);

app.listen(3000, ()=>console.log("listen at :3000"));