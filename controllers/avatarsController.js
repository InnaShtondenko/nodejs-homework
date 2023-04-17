const { ValidationError } = require("../helpers/errors");
const { modifyUserAvatar } = require("../services/avatarService");
const { updateUserProp } = require("../services/userService");

const updateAvatarController = async (req, res, next) => {
  const originalImg = req.file;
  const userId = req.user._id;

  if (!originalImg) throw new ValidationError("Image should be attached");
  const newAvatarURL = await modifyUserAvatar(originalImg, userId);
  const { avatarURL } = await updateUserProp(userId, {
    avatarURL: newAvatarURL,
  });

  res.json({avatarURL});
};

module.exports = { updateAvatarController };