module.exports = function addContact(name, number, Contact) {
  const contact = new Contact({
    name: name,
    number: number,
  })
  return contact.save()
}
