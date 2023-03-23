const { request, response } = require('express');
const express = require('express');
const app = express();


let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
const amount = contacts.length;
const date = new Date();
const utcDate = date.toString();
let info = [
   'Phonebook has info for ' + amount +' people',
   utcDate

]


app.get('/api/persons', (request, response) => { response.json(contacts) })

app.get('/info', (request, response) => { response.json(info) })

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find(contact => contact.id === id)
  if(contact){
    response.json(contact)
  } else {
    response.status(404).end(`'Can't find'` );
  }
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)