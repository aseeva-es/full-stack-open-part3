const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
  }

else if (process.argv.length === 3) {
    printList();
}
else if(process.argv.length === 5) {
    addContact();
}

else if (process.argv.length < 5) {
    console.log('contact is incomplete, provide phone')
    process.exit(1)
  }

else {
    console.log('usage: node mongo.js password [name] [phone]')
}



function printList(){
    const password = process.argv[2];
    const url =
     `mongodb+srv://aseevaes:${password}@cluster0.j3sslxx.mongodb.net/phoneBook?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false);
  mongoose.connect(url);

  const contactSchema = new mongoose.Schema({
    name: String,
    number: String
});
 
const Contact = mongoose.model('Contact', contactSchema);

  Contact.find({}).then(book => {
    console.log(`phonebook: `);
    book.forEach((contact)=>{console.log(contact.name, contact.number)})
    mongoose.connection.close()
})
}

function addContact(){
    const password = process.argv[2];
    const name = process.argv[3];
    const number = process.argv[4];
    const url =
     `mongodb+srv://aseevaes:${password}@cluster0.j3sslxx.mongodb.net/phoneBook?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false);
  mongoose.connect(url);
  
  const contactSchema = new mongoose.Schema({
      name: String,
      number: String
  });
   
  const Contact = mongoose.model('Contact', contactSchema);
  
  const contact = new Contact ({
      name: name,
      number: number,
  });
  
  contact.save().then(result => {
      console.log(`added ${name} ${number} to phonebook `)
      mongoose.connection.close()
  })

}