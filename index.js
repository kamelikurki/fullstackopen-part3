const express = require('express')
const morgan = require('morgan')
const { use } = require('express/lib/application')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('data', function getId (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} persons</p><p>${new Date()}</p>`);

})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === Number(id))

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }

})

app.post('/api/persons', (request, response) => {
  const newID = Math.floor(Math.random() * 10000)
  const person = request.body
  person.id = newID

  if (!(person.name && person.number)) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  else if (persons.find(existingPerson => existingPerson.name == person.name)) {
    return response.status(400).json({
      error: 'person already added to phonebook'
    })
  }

  persons = persons.concat(person)
  response.json(person)
})