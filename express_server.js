const express = require("express");
const app = express();
const PORT = 8080;

const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

const { redirect } = require("express/lib/response");
const { createUser, confirmUser, generateRandomString, urlsForUser } = require("./helpers/helpers");
const { userDatabase, urlDatabase } = require("./data/userData");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

}));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  const userID = req.session["user_id"];
  const currentUserId = userDatabase[userID];
  const filteredUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urls: filteredUrls, user: currentUserId };

  if (!userID) {
  
    res.redirect("/login");
 };

return res.render("urls_index", templateVars); 
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  const currentUserId = userDatabase[userID];
  const filteredUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urls: filteredUrls, user: currentUserId };

  if (!userID) {
  
    return res.status(403).send("Please sign in, or create an account!");
 };

return res.render("urls_index", templateVars); 
});

app.get("/urls/new", (req, res) => {
  const userID = req.session["user_id"];
  const currentUser = userDatabase[userID];
  const templateVars = { urls: urlDatabase, user: currentUser };

  if (userID) {
       return res.render("urls_new", templateVars);
    }

    return res.status(403).send("Please sign in, or create an account!");
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  const currentUser = userDatabase[userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user: currentUser };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  const currentUser = userDatabase[userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { urls: urlDatabase, user: currentUser };

  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const userID = req.session["user_id"];
  const currentUser = userDatabase[userID];
  const templateVars = { urls: urlDatabase, user: currentUser };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session["user_id"];
  const currentUser = userDatabase[userID];
  const templateVars = { urls: urlDatabase, user: currentUser };
  res.render("urls_login", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session["user_id"];
  const currentUser = userDatabase[userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user: currentUser };
  if (currentUser === userID) {
    return res.render("urls_index/:id", templateVars);
 }

 return res.status(403).send("Please sign in, or create an account!"); 
});

app.post("/urls", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID };
  
  res.redirect(`/urls/${shortURL}`);       
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  
  if (!userID) {

    return res.status(403).send("Please sign in, or create an account!\n"); 
 };
 if (userID !== urlDatabase[shortURL].userID) {
    return res.status(403).send("You must own a URL to delete it!");
 };
 delete (urlDatabase[shortURL]);
 res.redirect(`/urls`);       
});

app.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);      
});

app.post("/register", (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newUserID = generateRandomString();
  const newUser = {id: newUserID, email: req.body.email, password: hashedPassword};
  console.log("hash", hashedPassword);
  const { error, data } = createUser(userDatabase, newUser);

  if (error) {
    console.log(error);
    return res.status(400).send(error);
    }

  req.session["user_id"] = "user_id";
  return res.redirect("/urls");
   
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { error, data } = confirmUser(email, password);

  if (error) {
    console.log(error);
    return res.status(403).send("Forbidden - Account does not exist!");
  }

  req.session['user_id'] = data.id;
  res.redirect(`/urls`);       
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);       
});