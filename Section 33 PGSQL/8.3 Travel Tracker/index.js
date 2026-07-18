import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "",
  port: 5432,
});

await db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getVisitedCountries() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// GET home page
app.get("/", async (req, res) => {
  const countries = await getVisitedCountries();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  const country_name = req.body.country;

  try {
    const country = await db.query(
      "SELECT country_code FROM countries WHERE country_name LIKE '%' || $1 || '%'",
      [country_name],
    );
    const country_code = country.rows[0].country_code;
    try {
      const response = await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [country_code],
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await getVisitedCountries();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await getVisitedCountries();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

// I added this to reload the website freely without crashing
process.on("SIGINT", async () => {
  await db.end();
  process.exit();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
