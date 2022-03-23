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

const userDatabase = {
  "userRandomID": user,
  "user2@example.com": user2
}

module.exports = { userDatabase };