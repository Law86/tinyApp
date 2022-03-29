const { assert } = require('chai');
const { getUserByEmail } = require('../helpers/helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", user)
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
  it('should return a user with an invalid email', function() {
    const user = getUserByEmail("invalid@example.com", user)
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});