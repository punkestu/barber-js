const express = require("express");
const app = express();

app.use(express.json());

const auth = require("../src/app/auth")();
app.use("/person", auth.http);

app.listen(3000, ()=>console.log("listen at :3000"));