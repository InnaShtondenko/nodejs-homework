const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../helpers/errors");
const {
  addUser,
  getUserByEmail,
  updateUserToken,
  logoutUser,
  getUser,
} = require("../services/userService");

const addUserController = async (req, res) => {
  const newContact = await addUser(req.body);
  res.status(201).json(newContact);
};

const loginController = async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) throw new UnauthorizedError(`Email or password is wrong`);
  const { _id: userId, email, subscription, password } = user;

  const isCorrectPassword = await bcrypt.compare(req.body.password, password);
  if (!isCorrectPassword)
    throw new UnauthorizedError(`Email or password is wrong`);

  const token = jwt.sign({ userId }, process.env.SECRET_JWT);
  await updateUserToken(userId, token);

  res.json({ token, user: { email, subscription } });
};

const logoutController = async (req, res) => {
  const userToLogout = req.user._id;
  await logoutUser(userToLogout);
  res.sendStatus(204);
};

const getCurrentController = async (req, res) => {
  const currentUserId = req.user._id;
  const { email, subscription } = await getUser(currentUserId);
  res.json({ email, subscription });
};

module.exports = {
  addUserController,
  loginController,
  logoutController,
  getCurrentController,
};