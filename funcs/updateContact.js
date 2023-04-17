module.exports = function updateContact(Contact, id, name, number ){

  const contact = {
    name: name,
    number: number,
  }

  return Contact.findByIdAndUpdate(id, contact, { new: true })
}