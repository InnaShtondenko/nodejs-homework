const express = require("express");
const { asyncWrapper } = require("../../helpers/apiHelpers");
const {
  addUserController,
  loginController,
  logoutController,
  getCurrentController,
} = require("../../controllers/usersController");
const { userValidation } = require("../../middlewares/usersValidation");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/signup", userValidation, asyncWrapper(addUserController));
router.post("/login", userValidation, asyncWrapper(loginController));
router.get("/logout", auth, asyncWrapper(logoutController));
router.get("/current", auth, asyncWrapper(getCurrentController));

module.exports = router;