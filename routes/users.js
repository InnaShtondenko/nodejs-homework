const express = require("express");
const { asyncWrapper } = require("../helpers/apiHelpers");
const {addUserController,loginController,logoutController,getCurrentController,} = require("../controllers/usersController");
const { updateAvatarController } = require("../controllers/avatarsController");
const { userValidation } = require("../middlewares/usersValidation");
const auth = require("../middlewares/auth");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").at(-1);
    cb(null, file.fieldname + "-" + uuidv4() + "." + extension);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();


router.post("/signup", userValidation, asyncWrapper(addUserController));
router.post("/login", userValidation, asyncWrapper(loginController));
router.get("/logout", auth, asyncWrapper(logoutController));
router.get("/current", auth, asyncWrapper(getCurrentController));
router.patch("/avatars", auth, upload.single("avatar"), asyncWrapper(updateAvatarController));

module.exports = router;