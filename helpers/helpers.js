const bcrypt = require('bcryptjs');
const { userDatabase } = require("../data/userData");

function generateRandomString() {
  return Math.random().toString(20).substring(2, 8);
}

const createUser = (userDatabase, userInfo) => {
  const { id, email, password } = userInfo;
    console.log("create user function", id, email, password)
  if (!email || !password) {
    return { error: "400 Bad Request - Invalid credentials!", data: null }
  }

  const users = Object.values(userDatabase)
  const userFound = users.find(user => user.email === email)

  if (userFound) {
    return { error: "400 Bad Request - User Already Exists!", data: null}
  }

  const newUser = { id, email, password };
  userDatabase[id] = newUser;
  return { error: null, data: newUser };

}

const getUserByEmail = (givenEmail) => {
  for (let id in userDatabase) {
    const currentUser = userDatabase[id];
    if (currentUser.email === givenEmail) {
      return currentUser;
    }
  }
  return false;
}

const confirmUser = (email, password) => {
  const userFound = getUserByEmail(email) 
console.log(password, userFound.password)
  if (!userFound) {
    return { error: "403 Forbidden - Email Not Found"}
  }

  if (!bcrypt.compareSync(password, userFound.password)) {
    return { error: "403 Forbidden - Incorrect Password"}
  }
  
  return { error: null, data: userFound};
} 

const urlsForUser = (id, urlDB) => {
  const results = {};

  for (const url in urlDB) {
    
    if (id === urlDB[url].userID) {
      
      results[url] = urlDB[url]
    }
  }
  return results;
}

module.exports = { createUser, confirmUser, generateRandomString, urlsForUser, getUserByEmail } 