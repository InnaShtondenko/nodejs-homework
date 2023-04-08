const express = require("express");
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusContact,
} = require("../../controllers/contactsController");
const { asyncWrapper } = require("../../helpers/apiHelpers");
const auth = require("../../middlewares/auth");
const {
  newContactValidation,
  updatedContactValidation,
  updateStatusContactValidation,
} = require("../../middlewares/contactsValidation");
const router = express.Router();

router.get("/", auth, asyncWrapper(getContactsController));
router.get("/:contactId", auth, asyncWrapper(getContactByIdController));
router.post(
  "/",
  auth,
  newContactValidation,
  asyncWrapper(addContactController)
);
router.delete("/:contactId", auth, asyncWrapper(removeContactController));
router.put(
  "/:contactId",
  auth,
  updatedContactValidation,
  asyncWrapper(updateContactController)
);
router.patch(
  "/:contactId/favorite",
  auth,
  updateStatusContactValidation,
  asyncWrapper(updateStatusContact)
);

module.exports = router;