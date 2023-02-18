const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(morgan('dev'))

morgan.token('body', (req, res) => {
  if (req.body && Object.keys(req.body).length !== 0) {
    return JSON.stringify({
      name: req.body.name,
      number: req.body.number
    });
  } else {
    return '';
  }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelance",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-321321321"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-64654326"
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Welcome to this page!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  
  response.status(204).end()
})

const generateId = () => {
  const randomId = 10000 + Math.random() * 10000
  return Math.round(randomId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name) {
    return response.status(404).json({
      error: 'name missing'
    })
  }

  if(!body.number) {
    return response.status(404).json({
      error: 'number missing'
    })
  }

  const samePerson = persons.find(person => person.name === body.name)
  if(samePerson) {
    return response.status(404).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (req, res) => {
  res.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p> 
    `
    )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

