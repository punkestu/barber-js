const express = require("express");
const cors = require("cors");
const {join} = require("path");
const app = express();

app.set("view engine", "ejs");
app.set('views', join(__dirname, '/../client/views'));

app.use(cors());
app.use(express.json());
app.use("/public", express.static(join(__dirname, "../client/public")));

const auth = require("../src/app/auth")();
const authMid = require("../src/middleware/auth")(auth.repo);
app.use("/person", auth.http);

const shift = require("../src/app/shift")(authMid);
app.use("/shift", shift.http);

const barber = require("../src/app/barber")(auth.repo, shift.repo, authMid);
app.use("/barber", barber.http);

const order = require("../src/app/order")(authMid);
app.use("/order", order.http);

const view = require("../src/app/view")(barber.repo);
app.use("/", view.http);

app.listen(3000, ()=>console.log("listen at :3000"));