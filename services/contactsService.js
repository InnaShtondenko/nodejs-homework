const { Contact } = require("../db/contactModel");

async function getContacts(currUser) {
  return await Contact.find({ owner: currUser });
}

async function getContactById(userId, contactId) {
  return await Contact.findOne({ _id: contactId, owner: userId });
}

async function removeContact(userId, contactId) {
  return await Contact.findOneAndDelete({ _id: contactId, owner: userId });
}

async function addContact(reqBody) {
  const newContact = new Contact(reqBody);

  const result = await newContact.save();
  return result;
}

async function updateContact(userId, contactId, body) {
  const updatedContact = Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    body,
    {
      returnDocument: "after",
    }
  );
  return updatedContact;
}

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};