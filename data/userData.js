const user = {
  id: "userRandomID", 
  email: "user@example.com", 
  password: "purple-monkey-dinosaur"
}

const user2 = {
  id: "user2RandomID", 
  email: "user2@example.com", 
  password: "dishwasher-funk"
}

const user3 = {
  id: "Mike", 
  email: "mike@law.com", 
  password: "123"
}

const userDatabase = {
  "userRandomID": user,
  "user2RandomID": user2,
  "Mike": user3
}

const urlDatabase = {
  "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "aJ48lW"
    },
    "9sm5xK": {
        longURL: "https://www.google.com",
        userID: "aJ48lW"
    },
    "2fI3vb": {
      longURL: "https://www.tsn.com",
      userID: "Mike"
  }
};

module.exports = { userDatabase, urlDatabase };