const { request, response, json } = require('express');
const express = require('express');
const app = express();

app.use(express.json());

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
let info = 'Phonebook has info for ' + amount +' people </br>'+utcDate;


app.get('/api/persons', (request, response) => { response.json(contacts) })

app.get('/info', (request, response) => { response.send(info) })

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find(contact => contact.id === id)
  if(contact){
    response.json(contact)
  } else {
    response.status(404).end('Person not found' );
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find(contact => contact.id === id)
  if(contact){
    contacts = contacts.filter(contact => contact.id !== id);
    response.status(204).end('Contact deleted' );
  } else {
    response.status(404).end('Person not found');
  }
});

const generateId = (min = 1, max = 1000) => {
    return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  console.log("body: ", body);
  if(!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  contacts = contacts.concat(contact);

  console.log('contact: ', contact)
  response.json(contact)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)