const express = require("express");
const app = express();
const PORT = 8091;

const bodyParser = require("body-parser");
const cookies = require("cookie-parser")

const { redirect } = require("express/lib/response");
const { createUser, confirmUser } = require("./helpers/helpers");
const { userDatabase } = require("./data/userData");

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
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { 
    urls: urlDatabase,
    user: currentUser,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { 
    urls: urlDatabase,
    user: currentUser,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { shortURL, longURL, user: currentUser };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`);       
});

app.get("/u/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { 
    urls: urlDatabase,
    user: currentUser,
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

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect(`/urls`);       
});

app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { 
    urls: urlDatabase,
    user: currentUser,
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const newUser = req.body;
  const newUserID = generateRandomString();
  newUser["id"] = newUserID;
  const { error, data } = createUser(userDatabase, req.body);
 
  if (error) {
    console.log(error);
    return res.status(400).send("Bad Request");
    }
  
  res.cookie("user_id", newUserID)
  return res.redirect("/urls")
   
});

app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { 
    urls: urlDatabase,
    user: currentUser,
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const { error, data } = confirmUser(email, password);

  if (error) {
    console.log(error);
    return res.status(403).send("Forbidden");
  }

  res.cookie("user_id", data.id)
  res.redirect(`/urls`);       
});

function generateRandomString() {
  return Math.random().toString(20).substring(2, 8);
}