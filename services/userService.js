require("dotenv").config();
const bcrypt = require("bcryptjs");
const { User } = require("../db/UserModel");
const { DuplicateEmailError } = require("../helpers/errors");
const mailGun = require('mailgun-js');

const { MAILGUN_API_KEY, HOST_URL } = process.env;
// mailGun.setApiKey(MAILGUN_API_KEY);

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

async function sendVerificationToken(email, verificationToken) {
  const msg = {
    to: email,
    from: "lysatond@gmail.com",
    subject: "PhoneBook e-mail confirmation",
    html: `<p>Please,confirm you mail:</p>
    <a href="${HOST_URL + "api/users/verify/" + verificationToken}">
      Confirm
    </a>`,
  };
  await mailGun.send(msg);
}

async function getUserByToken(verificationToken) {
  return await User.findOne({ verificationToken });
}

async function confirmUserEmail(userId) {
  return await User.findOneAndUpdate(
    { _id: userId },
    { verify: true, verificationToken: null }
  );
}

async function getUserByEmail(userEmail) {
  return await User.findOne({ email: userEmail });
}

async function updateUserProp(userId, updatedProp) {
  return await User.findOneAndUpdate({ _id: userId }, updatedProp, {
    new: true,
  });
}

async function getUser(userId) {
  return await User.findOne({ _id: userId });
}

async function logoutUser(userID) {
  return await User.findOneAndUpdate({ _id: userID }, { token: null });
}

module.exports = {
  addUser,
  sendVerificationToken,
  getUserByToken,
  confirmUserEmail,
  getUserByEmail,
  updateUserProp,
  getUser,
  logoutUser,
};