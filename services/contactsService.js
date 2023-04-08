const { Contact } = require("../db/contactModel");

async function getContacts(currUser) {
  return await Contact.find({ owner: currUser });
}

async function getContactById(contactId) {
  return await Contact.findOne({ _id: contactId });
}

async function removeContact(contactId) {
  return await Contact.findOneAndDelete({ _id: contactId });
}

async function addContact(reqBody) {
  const newContact = new Contact(reqBody);

  const result = await newContact.save();
  return result;
}

async function updateContact(contactId, body) {
  const updatedContact = Contact.findByIdAndUpdate({ _id: contactId }, body, {
    returnDocument: "after",
  });
  return updatedContact;
}

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};