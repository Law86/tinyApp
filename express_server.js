const express = require("express");
const app = express();
const PORT = 8089;
const bodyParser = require("body-parser");
const cookies = require("cookie-parser")
const { redirect } = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}), cookies());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "3b2kPr" : "http://www.bluejays.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { shortURL, longURL, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`);       
});

app.get("/u/:shortURL", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.render("urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete (urlDatabase[shortURL])
  res.redirect(`/urls`);       
});

app.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`);      
});

app.post("/login", (req, res) => {
  const userCookie = req.body.username
  res.cookie("username", userCookie)
  res.redirect(`/urls`);       
});

app.post("/logout", (req, res) => {
  const userCookie = req.body.username
  res.clearCookie("username")
  res.redirect(`/urls`);       
});

function generateRandomString() {
  return Math.random().toString(20).substring(0, 5);
}