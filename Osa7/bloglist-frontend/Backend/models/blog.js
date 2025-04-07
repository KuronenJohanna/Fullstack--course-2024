const mongoose = require('mongoose')


const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    author: String,
    url: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      required: true,
      default: 0 // Jos käyttäjä ei syötä arvoa, likes saa oletusarvoksi 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  });


  blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString(); // Muutetaan _id -> id
      delete returnedObject._id; // Poistetaan _id
      delete returnedObject.__v; // Poistetaan myös __v, joka on Mongoosen versiointikenttä
    }
  });




module.exports = mongoose.model('Blog', blogSchema)