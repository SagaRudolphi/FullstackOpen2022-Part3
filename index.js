const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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
]

app.get('/', (request, response) => {
    response.send('<h1>Welcome to my phonebook</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  
app.get('/info', (request, response) => {
    response.send(`<p>This phonebook has info of ${Object.keys(persons).length} contacts</p> <p> ${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id=== id)
  
  if (person) {
    response.json(person)  
  }
  else{
    response.statusMessage = "The person was not found"
    response.status(404).end()
   }
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body

   
  if ( !newPerson.hasOwnProperty('name') || !newPerson.hasOwnProperty('number') || newPerson.name === "" || newPerson.number === "" ) {
    response.statusMessage = "Error: Name or phonenumber is missing"
    response.status(404).end()
  }
  else if (persons.some(person => person.name === newPerson.name)) {
    response.statusMessage = "Error: Name must be unique"
    response.status(400).end()
  }
  else {
    const max = 10000
    const randomID = Math.floor(Math.random() * max)

    newPerson.id = randomID

    persons = persons.concat(newPerson)

    console.log(newPerson)
    response.json(newPerson)
    response.status(200).end()
  }
})  

const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)