require('dotenv').config()
const express = require('express')
const app = express()
/* const morgan = require('morgan') */
const cors = require('cors')
const Person = require('./models/person')

/* app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

morgan.token('postData', function (req, res) {
  if (req.method === 'POST') {
    return ' ' + JSON.stringify(req.body)
  }
  return ''
}) */

const reqLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', JSON.stringify(request.body))
  console.log('----')
  next()
}
app.use(express.json())

app.use(reqLogger)

app.use(cors())

app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Welcome to my phonebook</h1>')
})

app.get('/info', (request, response) => {

  Person.count({}, function (err, count) {
    console.log('Number of persons', count)
    response.send(`<p>This phonebook has info of ${count} contacts.</p> <p> ${new Date()}</p>`)
  })


})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

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

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body


  Person.findByIdAndUpdate(request.params.id, body, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoints = (request, response) => {
  response.status(404).send({ error: 'unknonwn endpoint' })
}

app.use(unknownEndpoints)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
