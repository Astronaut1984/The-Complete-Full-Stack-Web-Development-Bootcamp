//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const password = "ILoveProgramming";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
  let pass = req.body.password;
  if (pass == password) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
    res.status(403).send("<h1>403 Forbidden</h1>");
  }
});

app.get("/check", (req, res) => {
  res.status(403).send("<h1>403 Forbidden</h1>");
});

app.use(function (req, res, next) {
  res.status(404).send("<h1>404 Not found</h1>");
});

app.use(function (req, res, next) {
  res.status(403).send("<h1>403 Forbidden</h1>");
});
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
