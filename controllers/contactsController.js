const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../services/contactsService");
const { WrongIdError } = require("../helpers/errors");

const getContactsController = async (req, res) => {
  const data = await getContacts();
  res.json(data);
};

const addContactController = async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }
  res.json(contact);
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;
  const removedContact = await removeContact(contactId);

  if (!removedContact) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }

  res.json(removedContact);
};

const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const contactToBeUpdated = await getContactById(contactId);

  if (!contactToBeUpdated) {
    throw new WrongIdError(
      `Failure, no contacts with id '${contactId}' found!`
    );
  }

  const updatedContact = await updateContact(contactId, {
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