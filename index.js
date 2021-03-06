const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
//const { use } = require('express/lib/application')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
//app.use(requestLogger)






morgan.token('data', function getId(req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const Person = require('./models/person')

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/info', (req, res) => {

  Person.find({}).then(persons => {
    console.log(persons.length)
    res.send(`<p>Phonebook has info for ${persons.length} persons</p><p>${new Date()}</p>`)
  })
  

})

/*
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
*/
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => { 
      const personreturn = {
        name: person.Name,
        number: person.Number,
        id: person._id
      }
      response.json(personreturn)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const person = request.body

  if (!(person.name && person.number)) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  /*
  else if (persons.find(existingPerson => existingPerson.name == person.name)) {
    return response.status(400).json({
      error: 'person already added to phonebook'
    })
  }
*/
  const persontoadd = new Person({
    Name: person.name,
    Number: person.number
  })

  persontoadd.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    Name: body.name,
    Number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



// olemattomien osoitteiden k??sittely
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// virheellisten pyynt??jen k??sittely
app.use(errorHandler)