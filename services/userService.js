const bcrypt = require("bcryptjs");

const { User } = require("../db/UserModel");
const { DuplicateEmailError } = require("../helpers/errors");

async function addUser(reqBody) {
  reqBody.password = bcrypt.hashSync(reqBody.password, 8);

  const newUser = new User(reqBody);
  try {
    const { email, subscription } = await newUser.save();
    return { email, subscription };
  } catch (error) {
    if (error.code === 11000) throw new DuplicateEmailError("Email in use");
    throw error;
  }
}

async function getUserByEmail(userEmail) {
  return await User.findOne({ email: userEmail });
}

async function updateUserToken(userId, token) {
  return await User.findOneAndUpdate({ _id: userId }, { token });
}

async function getUser(userId) {
  return await User.findOne({ _id: userId });
}

async function logoutUser(userID) {
  return await User.findOneAndUpdate({ _id: userID }, { token: null });
}

module.exports = {
  addUser,
  getUserByEmail,
  updateUserToken,
  getUser,
  logoutUser,
};