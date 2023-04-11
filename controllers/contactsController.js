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
  const contact = await getContactById(currUser, contactId);

  if (!contact) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }
  res.json(contact);
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;
  const removedContact = await removeContact(req.user._id, contactId);

  res.json(removedContact);
};

const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  const updatedContact = await updateContact(req.user._id, contactId, req.body);
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  const updatedContact = await updateContact(req.user._id, contactId, {
    favorite: req.body.favorite,
  });
  res.json(updatedContact);
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusContact,
};