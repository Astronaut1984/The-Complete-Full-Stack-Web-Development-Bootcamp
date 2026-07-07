import express from "express";

const app = express();
const port = 3000;

app.get("/", function (req, res) {
  res.send(
    `<h1 style="background-color: blue; color: white;">Hello World</h1>`,
  );
});

app.get("/about", function (req, res) {
  res.send(`<h1>About Page</h1>`);
});

app.get("/contact", function (req, res) {
  res.send(`<h1>Contact Page</h1>`);
});

app.use(function (req, res, next) {
  res.status(404).send("<h1>404 Not found</h1>");
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
