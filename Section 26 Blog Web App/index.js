import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs, { read } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

const DATA_FILE = path.join(__dirname, "/data/data.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return raw ? JSON.parse(raw) : {};
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getBlogById(id) {
  const blogs = readData();
  return blogs[id] || null;
}

app.get("/", (req, res) => {
  const latestBlogs = Object.entries(readData())
    .sort((a, b) => b[0] - a[0])
    .slice(0, 3)
    .map(([id, blog]) => ({ id, ...blog }));
  res.render("index.ejs", { currentPage: "home", latestBlogs });
});

app.get("/create_blog", (req, res) => {
  res.render("create_blog.ejs", { currentPage: "create" });
});

app.get("/blogs", (req, res) => {
  const blogs = readData();
  const blogTitles = Object.entries(blogs).map(([id, blog]) => ({
    id,
    title: blog.title,
  }));
  res.render("blogs.ejs", { currentPage: "blogs", blogTitles });
});

app.get("/blogs/:id", (req, res) => {
  const blog = getBlogById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  res.render("blog.ejs", { currentPage: "blogs", blog, id: req.params.id });
});

app.get("/edit_blog/:id", (req, res) => {
  const blog = getBlogById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  res.render("edit_blog.ejs", { currentPage: "edit", blog, id: req.params.id });
});

app.post("/edit_blog/:id", (req, res) => {
  const { title, content } = req.body;
  const data = readData();
  if (!data[req.params.id]) {
    return res.status(404).send("Blog not found");
  }
  data[req.params.id] = { title, content };
  writeData(data);
  res.redirect("/blogs");
});

app.post("/delete_blog/:id", (req, res) => {
  const data = readData();
  if (!data[req.params.id]) {
    return res.status(404).send("Blog not found");
  }
  delete data[req.params.id];
  writeData(data);
  res.redirect("/blogs");
});

app.post("/create_blog", (req, res) => {
  // Handle blog creation logic here
  const { title, content } = req.body;

  const data = readData();
  const id = Date.now().toString();
  data[id] = { title, content };
  writeData(data);

  res.redirect("/blogs");
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started at port ${port}`);
});
