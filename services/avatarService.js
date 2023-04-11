const Jimp = require("jimp");
const fs = require("fs");
const { ValidationError } = require("../helpers/errors");

async function modifyUserAvatar(originalImg, userId) {
  const { path: originalImgPath } = originalImg;
  const imgExtension = originalImgPath.split(".").at(-1);
  const newImgPath = path.join("public","avatars",`avatar-${userId }.${imgExtension}`);

  if (imgExtension !== "png") {
    fs.unlinkSync(originalImgPath);
    throw new ValidationError("The image should have a png format");
  }

  Jimp.read(originalImgPath, (err, img) => {
    if (err) {
      fs.unlinkSync(originalImgPath);
      throw err;
    }
    img.resize(250, 250).write(newImgPath);
    fs.unlinkSync(originalImgPath);
  });

  return `/avatars/avatar-${userId }.${imgExtension}`;
}

module.exports = { modifyUserAvatar };