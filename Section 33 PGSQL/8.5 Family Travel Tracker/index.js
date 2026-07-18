import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "[]",
  host: "[]",
  database: "[]",
  password: "[]",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// let users = [
//   { id: 1, name: "Angela", color: "teal" },
//   { id: 2, name: "Jack", color: "powderblue" },
// ];

async function checkVisisted() {
  const result = await db.query(
    `
      SELECT country_code 
      FROM visited_countries
      JOIN users ON users.id = visited_countries.user_id
      WHERE users.id = $1
    `,
    [currentUserId],
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const users = await getUsers();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: users.find((user) => user.id === currentUserId).color,
  });
});

app.get("/new", async (req, res) => {
  res.render("new.ejs", {});
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()],
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId],
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  const reqBody = req.body;
  if (reqBody.add) {
    res.redirect("/new");
  } else if (reqBody.user) {
    currentUserId = parseInt(reqBody.user);
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body.name;
  const color = req.body.color;

  const response = await db.query(
    "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id",
    [name, color],
  );

  const id = response.rows[0].id;
  currentUserId = id;

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
