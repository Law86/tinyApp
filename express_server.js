const express = require("express");
const app = express();
const PORT = 8091;

const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const cookies = require("cookie-parser")

const { redirect } = require("express/lib/response");
const { createUser, confirmUser, generateRandomString, urlsForUser } = require("./helpers/helpers");
const { userDatabase, urlDatabase } = require("./data/userData");

app.use(bodyParser.urlencoded({extended: true}), cookies());
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUserId = userDatabase[userID].id
  const filteredUrls = urlsForUser(userID, urlDatabase)
  const templateVars = { urls: filteredUrls, user: currentUserId };

  if (userID === currentUserId) {

    return res.render("urls_index", templateVars);
 }

 return res.status(403).send("Please sign in, or create an account!"); 
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  
  const templateVars = { urls: urlDatabase, user: currentUser };

  if (userID) {
       return res.render("urls_new", templateVars);
    }

    return res.status(403).send("Please sign in, or create an account!");
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL
  const templateVars = { shortURL, longURL, user: currentUser };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL
  const templateVars = { urls: urlDatabase, user: currentUser };

  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { urls: urlDatabase, user: currentUser };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const templateVars = { urls: urlDatabase, user: currentUser };
  res.render("urls_login", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.cookies["user_id"];
  const currentUser = userDatabase[userID]
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL
  const templateVars = { shortURL, longURL, user: currentUser };
  if (currentUser === userID) {
    return res.render("urls_index/:id", templateVars);
 }

 return res.status(403).send("Please sign in, or create an account!"); 
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL
  const userID = req.cookies["user_id"];
  urlDatabase[shortURL] = { longURL, userID }
  console.log("url database", urlDatabase)
  
  urlDatabase[shortURL] = longURL

  res.redirect(`/urls/${shortURL}`);       
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.cookies["user_id"];
  const shortURL = req.params.shortURL
  
  if (!userID) {

    return res.status(403).send("Please sign in, or create an account!\n"); 
 }
 if (userID !== urlDatabase[shortURL].userID) {
    return res.status(403).send("You must own a URL to delete it!");
 }
 delete (urlDatabase[shortURL])
 res.redirect(`/urls`);       
});

app.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`);      
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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { error, data } = confirmUser(email, password);

  if (error) {
    console.log(error);
    return res.status(403).send("Forbidden - Account does not exist!");
  }

  res.cookie("user_id", data.id)
  res.redirect(`/urls`);       
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect(`/`);       
});
