const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors");
const { getUser } = require("../services/userService");
require("dotenv").config();

const jwtSecret = process.env.SECRET_JWT;

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [authType, token] = authorization.split(" ");

  if (authType !== "Bearer" || !token) {
    return next(new UnauthorizedError("Not authorized"));
  }

  try {
    const {userId} = jwt.verify(token, jwtSecret);

    const userData = await getUser(userId);
    if (userData.token !== token) throw new Error();

    const { email, _id, subscription } = userData;
    req.user = { _id, email, subscription };
    next();
  } catch {
    next(new UnauthorizedError("Not authorized"));
  }
};

module.exports = auth;