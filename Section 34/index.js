import express from "express";
import bodyParser, { urlencoded } from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "",
  password: "",
  port: 5432,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function getCoverSrc(cover_i) {
  if (!cover_i) {
    return "https://placehold.co/350x500?text=No+Cover+Available";
  }
  return `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
}

async function getBooks() {
  const data = await db.query("SELECT * FROM reviews ORDER BY id");
  return data.rows;
}

async function getBook(id) {
  const data = await db.query("SELECT * FROM reviews WHERE id = $1", [id]);
  return data.rows;
}

app.get("/", async (req, res) => {
  const books = await getBooks();
  res.render("index.ejs", { books });
});

app.get("/new", (req, res) => {
  const { title, author, coverSrc } = req.query;
  if (title && author && coverSrc) {
    res.render("new_book.ejs", { title, author, coverSrc });
  } else {
    res.render("new_book.ejs");
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const books = await getBooks();
  const booksWithEdit = books.map((book) => ({
    ...book,
    edit: book.id === Number(id),
  }));

  res.render("index.ejs", { books: booksWithEdit });
});

app.get("/book", (req, res) => {
  const { title, author, coverId } = req.query;
  const coverSrc = getCoverSrc(coverId);

  const params = new URLSearchParams({ title, author, coverSrc });
  res.redirect(`/new?${params.toString()}`);
});

app.post("/add-rating", async (req, res) => {
  const data = req.body;
  await db.query(
    `
    INSERT INTO reviews (title, author, coversrc, rating, review)
    VALUES ($1, $2, $3, $4, $5);
    `,
    [
      data.title,
      data.author,
      data.coverSrc,
      parseInt(data.rating),
      data.review,
    ],
  );
  res.redirect("/");
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { review, rating } = req.body;

  await db.query(
    `
    UPDATE reviews
    SET review = $1, rating = $2
    WHERE id = $3;
    `,
    [review, parseInt(rating), id],
  );

  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.query(
    `
    DELETE FROM reviews
    WHERE id = $1
    `,
    [id],
  );
  res.redirect("/");
});

app.listen(port, (err) => {
  if (err) {
    throw err;
    return;
  }
  console.log("Server started at port " + port);
});
