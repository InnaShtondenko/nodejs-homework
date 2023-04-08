const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../services/contactsService");
const { WrongIdError } = require("../helpers/errors");

const getContactsController = async (req, res) => {
  const currUser = req.user._id;
  const data = await getContacts(currUser);
  res.json(data);
};

const addContactController = async (req, res) => {
  const currUser = req.user._id;

  const newContact = await addContact({ ...req.body, owner: currUser });
  res.status(201).json(newContact);
};

const getContactByIdController = async (req, res) => {
  const currUser = req.user._id;

  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if ( contact?.owner.toString() !== currUser.toString()) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }
  res.json(contact);
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;

  await checkOwnership(req.user._id, contactId);
  const removedContact = await removeContact(contactId);

  res.json(removedContact);
};

const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  await checkOwnership(req.user._id, contactId);

  const updatedContact = await updateContact(contactId, req.body);
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  await checkOwnership(req.user._id, contactId);

  const updatedContact = await updateContact(contactId, {
    favorite: req.body.favorite,
  });
  res.json(updatedContact);
};

const checkOwnership = async (userId, contactId) => {
  const contact = await getContactById(contactId);
  if (!contact || contact.owner.toString() !== userId.toString()) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }
  return true;
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusContact,
};