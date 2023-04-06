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
const {
  newContactValidaion,
  updatedContactValidation,
  updateStatusContactValidation,
} = require("../../middlewares/validationMiddleware");
const router = express.Router();

router.get("/", asyncWrapper(getContactsController));
router.get("/:contactId", asyncWrapper(getContactByIdController));
router.post("/", newContactValidaion, asyncWrapper(addContactController));
router.delete("/:contactId", asyncWrapper(removeContactController));
router.put(
  "/:contactId",
  updatedContactValidation,
  asyncWrapper(updateContactController)
);
router.patch(
  "/:contactId/favorite",
  updateStatusContactValidation,
  asyncWrapper(updateStatusContact)
);

module.exports = router;