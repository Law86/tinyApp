const user1 = {
  id: "Mike", 
  email: "mike@law.com", 
  password: "$2a$10$CbuT6sAZoMi9HcfO6WrQO.zFVnO.4puT6YGf2Fa5nTr8mN2fIaZyu"
}

const userDatabase = {
  "Mike": user1
}

const urlDatabase = {
  "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "Mike"
    },
    "9sm5xK": {
        longURL: "https://www.google.com",
        userID: "Mike"
    },
    "2fI3vb": {
      longURL: "https://www.tsn.com",
      userID: "Mike"
  },
  "m5l78s": {
    longURL: "https://www.cnn.com",
    userID: "Test"
  }
};

module.exports = { userDatabase, urlDatabase };