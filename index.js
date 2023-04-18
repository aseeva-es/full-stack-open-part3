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
const updateContact = require("./funcs/updateContact");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
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

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  console.log("id: ", id);
  getContact(Contact, id).then(contact =>{
    if (contact) {
      response.json(contact);
    } else {
      response.status(404).end("Person not found");
    }
  })
  .catch(error => next(error)
  )
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
 delContact(Contact, id)
 .then(contact => {
   if (contact) {
    console.log('deleted', contact)
     response.status(204).end("Contact deleted");
   }
 })
 .catch(error => next(error))
});

app.post("/api/persons", (request, response, next) => {
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
 
  addContact(body.name, body.number, Contact)
  .then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook `);
    response.json(result);
  })
  .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {

  const {name, number} = request.body;
  const id = request.params.id;
  if (!request.body) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (!name) {
    return response.status(400).json({ error: "please enter name" });
  }
  if (!number) {
    return response.status(400).json({ error: "please enter number" });
  }
 
  updateContact(Contact, id, name, number)
  .then((result) => {
    console.log(`updated ${result.name} ${result.number} in the phonebook `);
    response.json(result);
  })
  .catch(error => next(error));
});

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
