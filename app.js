const express = require("express");
const app = express();
const port = 2000;
const middlewares = require("./middlewares/middlewares");
const connect = require("./schemas");
connect();

const PostRouter = require("./routers/index");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use("/api", [PostRouter]);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/detail", (req, res) => {
  res.render("detail");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
