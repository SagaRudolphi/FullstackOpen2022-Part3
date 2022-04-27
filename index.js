const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

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
  response.send(`<p>This phonebook has info of ${Object.keys(persons).length} contacts.</p> <p> ${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    return response.status(200).json(person)
  }
  else {
    
    return response.status(404).json({ error: 'Person not found'})
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  person = persons.filter(person => person.id !== id)

  return response.status(204)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = Math.floor(Math.random() * 5000)

  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'The name must be unique'
    })
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  console.log(person)
  response.json(person)
})



const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)