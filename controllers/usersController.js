const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const gravatar = require("gravatar");

const {
  UnauthorizedError,
  NotFoundError,
  NodeError,
} = require("../helpers/errors");
const {
  addUser,
  getUserByEmail,
  updateUserProp,
  logoutUser,
  getUser,
  getUserByToken,
  confirmUserEmail,
  sendVerificationToken,
} = require("../services/userService");

const addUserController = async (req, res) => {
  const avatarURL = gravatar.url(req.body.email, { protocol: "http" });
  const verificationToken = uuidv4();

  const newUser = await addUser({ ...req.body, avatarURL, verificationToken });
  await sendVerificationToken(req.body.email, verificationToken);

  res.status(201).json(newUser);
};

const sendVerificationTokenController = async (req, res) => {
  const { verify, verificationToken } = await getUserByEmail(req.body.email);
  if (verify) throw new NodeError("Verification has already been passed!");

  await sendVerificationToken(req.body.email, verificationToken);
  res.json({ message: "Verification email sent" });
};

const verifyEmailController = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await getUserByToken(verificationToken);
  if (!user) throw new NotFoundError("User not found");

  const { _id: userId } = user;
  await confirmUserEmail(userId);
  res.json({ message: "Verification successful" });
};

const loginController = async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) throw new UnauthorizedError(`Email or password is wrong`);
  const { _id: userId, email, subscription, password, verify } = user;

  const isCorrectPassword = await bcrypt.compare(req.body.password, password);
  if (!isCorrectPassword)
    throw new UnauthorizedError(`Email or password is wrong`);

  if (!verify) throw new UnauthorizedError(`Email is not verified!`);

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
  verifyEmailController,
  sendVerificationTokenController,
  loginController,
  logoutController,
  getCurrentController,
};