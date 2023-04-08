module.exports = function delContact(Contact, id){
    return Contact.findByIdAndDelete(id);
}