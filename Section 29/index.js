import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const API_URL = "https://opentdb.com/api.php";
const API_TOKEN_URL = "https://opentdb.com/api_token.php";
const app = express();

let token = "";
let token_url = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getToken() {
  try {
    const response = await axios.get(API_TOKEN_URL + "?command=request");
    console.log(response.data);
    token = response.data.token;
    token_url = `&token=${token}`;
    return token;
  } catch (err) {
    console.error("Failed to get token:", err.message);
    token = "";
    token_url = "";
    throw err;
  }
}

async function resetToken() {
  try {
    const response = await axios.get(
      API_TOKEN_URL + `?command=reset${token_url}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to reset token:", err.message);
    throw err;
  }
}

app.get("/", async (req, res) => {
  try {
    if (token == "") {
      await getToken();
    }
    res.render("index.ejs", {});
  } catch (err) {
    console.error("Error rendering index:", err.message);
    res.status(500).send("Something went wrong loading the page.");
  }
});

app.post("/start_quiz", async (req, res) => {
  try {
    const reqData = req.body;

    // Basic validation
    if (!reqData.trivia_amount) {
      return res.status(400).send("Missing trivia amount.");
    }

    let reqQuery = `?amount=${reqData.trivia_amount}`;
    if (reqData.trivia_category && reqData.trivia_category != "any") {
      reqQuery += `&category=${reqData.trivia_category}`;
    }
    if (reqData.trivia_difficulty && reqData.trivia_difficulty != "any") {
      reqQuery += `&difficulty=${reqData.trivia_difficulty}`;
    }
    reqQuery += `&type=boolean`;

    console.log(reqQuery);

    let result;
    try {
      console.log(API_URL + reqQuery + token_url);
      const response = await axios.get(API_URL + reqQuery + token_url);
      result = response.data; // keep full object: { response_code, results }
    } catch (apiErr) {
      console.error("Trivia API request failed:", apiErr.message);
      return res
        .status(502)
        .send("Failed to reach the trivia API. Please try again later.");
    }

    // response_code 4 = all possible questions for that query have been used, need a new token
    if (result.response_code == 4) {
      try {
        await getToken();
        const retryResponse = await axios.get(API_URL + reqQuery + token_url);
        result = retryResponse.data;
      } catch (retryErr) {
        console.error("Retry after token refresh failed:", retryErr.message);
        return res
          .status(502)
          .send("Failed to fetch new trivia questions. Please try again.");
      }
    }

    // Catch other non-zero response codes (invalid params, token empty, etc.)
    if (result.response_code != 0) {
      console.error("Trivia API returned error code:", result.response_code);
      return res
        .status(400)
        .send(
          "The trivia API couldn't fulfill this request (try different settings).",
        );
    }

    res.render("quiz.ejs", { quizData: result });
  } catch (err) {
    console.error("Unexpected error in /start_quiz:", err.message);
    res.status(500).send("Something went wrong starting the quiz.");
  }
});

// Catch-all error handler (for anything that slips through, e.g. sync errors)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send("Internal server error.");
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server started at port " + port);
});
