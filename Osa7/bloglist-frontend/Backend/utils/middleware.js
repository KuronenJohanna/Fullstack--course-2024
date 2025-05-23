const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null; // Ei tokenia annettu, asetetaan null mutta ei palauteta virhettä vielä
  }
  next(); // Siirrytään aina seuraavaan middlewareen riippumatta siitä, onko token annettu vai ei
};

const userExtractor = async (request, response, next) => {

  if (!request.token) {
    return response.status(401).json({ error: 'Unauthorized' }); // Palautetaan 401 vain jos token puuttuu ja tarvitaan
  }
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    response.status(401).send({ error: 'token invalid' })
    
  }
  request.user = await User.findById(decodedToken.id)
  
  next()
}

module.exports = {
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}