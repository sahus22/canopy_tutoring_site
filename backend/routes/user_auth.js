var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt')
const salt_rounds = 10

const authorize = require('./middleware/authorize')

const token_utils = require('./utils/token')

const user_auth_DAO = require('../DAO/user_auth_DAO')
const users_DAO = require('../DAO/users_DAO')

function format_user_auth(user_auth){
  // return a jwt for the client to authenticate with
  // create and return the token
  let user = {
    user_id: user_auth._id,
    username: user_auth.username,
    email: user_auth.email,
  }
  let token = token_utils.create_token(user)
  user.token = token
  return user
}

// register a user in the system
router.post('/register', async (req, res) => {
  let { username, email, password } = req.body;

  // all fields must be present
  if (!username || !email || !password) {
    res.sendStatus(401)
    return;
  }

  // username and email must be unique
  let existing_user = await user_auth_DAO.get_by_email(email) || await user_auth_DAO.get_by_username(username)
  if (existing_user) {
    res.sendStatus(400)
    return;
  }

  // create the user_auth object for signing in
  const password_hash = await bcrypt.hash(password, salt_rounds)

  let user_auth = await user_auth_DAO.create({ username, email, password, password_hash })

  // create the user object for general use
  await users_DAO.create({
    name: username,
    email_address: email,
    profile_image: "images/default.jpg",
    favorite_tutors: [],
    tutor_details: null,
  }, user_auth._id)

  let user = format_user_auth(user_auth)
  return res.json(user)
})


// log in with a username/email and password
router.post('/login', async (req, res) => {
  let { username, email, password } = req.body

  // get the user auth by username or email
  let user_auth;
  if (username) {
    user_auth = await user_auth_DAO.get_by_username(username)
  } else if (email) {
    user_auth = await user_auth_DAO.get_by_email(email)
  }
  if (!user_auth) {
    // either no login id provided or user doesn't exist
    return res.sendStatus(400)
  }

  // if the given password doesn't hash to the stored hash, it's wrong
  // return 401 unauthorized
  const match = await bcrypt.compare(password, user_auth.password_hash)
  if (!match) {
    return res.sendStatus(401)
  }

  // passwords matched! return a jwt for the client to authenticate with
  let user = format_user_auth(user_auth)
  return res.json(user)
})

// change a user's password
router.put('/change_password', authorize, async (req, res) => {

  let { new_password, old_password } = req.body

  // get user id from the auth token
  let user_data = token_utils.get_user_data_from_request(req)

  let user_auth = user_auth_DAO.get(user_data.user_id)
  // if the given password doesn't hash to the stored hash, it's wrong
  // return 401 unauthorized
  const match = await bcrypt.compare(old_password, user_auth.password_hash)
  if (!match) {
    return res.sendStatus(401)
  }

  // update the password
  let password_hash = await bcrypt.hash(new_password, salt_rounds)
  user_auth.password_hash = password_hash
  await user_auth_DAO.update(user_auth._id, user_auth)

  // create and return the token
  let user = format_user_auth(user_auth)
  return res.json(user)
})

// remove a user from the system
router.delete('/unregister', authorize, async (req, res) => {
  // get user id from the auth token
  let user_data = token_utils.get_user_data_from_request(req)
  // delete the user
  let results_auth = await user_auth_DAO.remove(user_data.user_id);
  let results_user = await users_DAO.remove(user_data.user_id)
  return res.json({results_auth, results_user});
})

module.exports = router;
