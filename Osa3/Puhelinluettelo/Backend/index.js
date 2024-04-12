
/* MUISTA MUOKATA .ENV TIEDOSTO, NIIN ETTEI URL SIVU JA SALASANA MENE PALVELIMELLE */


require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')

const Person = require('./models/person')

app.use(express.static('dist'))

morgan.token('Data', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status - :response-time ms :Data'));


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === "CastError") {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(requestLogger)



app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }

  })
  .catch(error => next(error))
  
})
app.get('/api/info', (request, response) => {

  Person
    .find({})
    .then(persons => {
      const lengthPersons = persons.length
      const currentDate = new Date()
      response.send(`<p>Phonebook has info for ${lengthPersons} people</p></br><p>${currentDate}</p>`)
    })
  

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))

  
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  /*findName = Person.find(person => person.name === body.name)
  
  if (findName) {
    return response.status(400).json({
      error:'name must be unique'
    })
  }
*/
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
  
  
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number }, 
    { new: true, runValidators:true, context: 'query' }
  )
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

