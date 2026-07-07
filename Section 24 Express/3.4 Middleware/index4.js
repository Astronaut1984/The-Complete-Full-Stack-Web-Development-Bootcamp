import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let bandName = "";

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res, next) => {
  console.log(req.body);
  bandName = req.body.street + req.body.pet;
  res.send(`<h1>Here is you band name</h1> <p>${bandName}</p>`);
  next();
});

app.get("/submit", (req, res, next) => {
  res.send(`<h1>Here is you band name</h1> <p>${bandName}</p>`);
}); 

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
