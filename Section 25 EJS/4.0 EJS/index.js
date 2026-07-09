import express from "express";

const app = express();
const port = 3000;

function dayMessage() {
  let currDate = new Date();
  let currDay = currDate.getDay();
  if (currDay == 0 || currDay == 6) {
    return {
      day: "the weekend",
      message: "have fun!",
    };
  } else {
    return {
      day: "a weekday",
      message: "work hard!",
    };
  }
}

app.get("/", function (req, res) {
  res.render("index.ejs", dayMessage());
});

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Server started in port ${port}`);
});
