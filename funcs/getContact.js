module.exports = function getContact(Contact,id){
  return Contact.findById(id)
}