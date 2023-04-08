const { request, response, json } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/contact");
const listContacts = require("./funcs/listContacts");
const addContact = require("./funcs/addContact");
const getContact = require("./funcs/getContact");
const delContact = require("./funcs/delContact");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("params", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :params"
  )
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (request, response) => {
  listContacts(Contact).then((book) => {
    console.log("phonebook: ", book);
    response.send(book);
  });
});

app.get("/info", (request, response) => {
  Contact.count({}).then(count =>{
    const date = new Date();
    const utcDate = date.toString();
    let info = "Phonebook has info for " + count + " people </br>" + utcDate;
    response.send(info);

  })
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log("id: ", id);
  // const contact = contacts.find((contact) => contact.id === id);
  getContact(Contact, id).then(contact =>{
    if (contact) {
      response.json(contact);
    } else {
      response.status(404).end("Person not found");
    }

  })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
 delContact(Contact, id)
 .then(contact => {
   if (contact) {
    console.log('deleted', contact)
     response.status(204).end("Contact deleted");
   } else {
     response.status(404).end("Person not found");
   }

 })
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (!body.name) {
    return response.status(400).json({ error: "please enter name" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "please enter number" });
  }
  // if (nameExist(contacts, body.name)) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }

  addContact(body.name, body.number, Contact)
  .then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook `);
    response.json(result);
  });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
