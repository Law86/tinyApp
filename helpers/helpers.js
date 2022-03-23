const createUser = (userDatabase, userInfo) => {
  const { id, email, password } = userInfo;
    console.log("create user function", id, email, password)
  if (!email || !password) {
    return { error: "400 Bad Request", data: null }
  }

  if (email === "" || password === "") {
    return { error: "400 Bad Request", data: null}
  }

  const users = Object.values(userDatabase)
  const userFound = users.find(user => user.email === email)
  if (userFound) {
    return { error: "400 Bad Request", data: null}
  }

  const newUser = { id, email, password };
  userDatabase[id] = newUser;
  console.log(userDatabase)
  return { error: null, data: newUser };

}

module.exports = { createUser } 