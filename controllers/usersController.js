const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { UnauthorizedError } = require("../helpers/errors");
const {
  addUser,
  getUserByEmail,
  updateUserProp,
  logoutUser,
  getUser,
} = require("../services/userService");

const addUserController = async (req, res) => {
  const avatarURL = gravatar.url(req.body.email, { protocol: "http" });
  const newUser = await addUser({ ...req.body, avatarURL: avatarURL });
  res.status(201).json(newUser);
};

const loginController = async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) throw new UnauthorizedError(`Email or password is wrong`);
  const { _id: userId, email, subscription, password } = user;

  const isCorrectPassword = await bcrypt.compare(req.body.password, password);
  if (!isCorrectPassword)
    throw new UnauthorizedError(`Email or password is wrong`);

  const token = jwt.sign({ userId }, process.env.SECRET_JWT);
  await updateUserProp(userId, { token: token });

  res.status(200).json({ token, user: { email, subscription } });
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