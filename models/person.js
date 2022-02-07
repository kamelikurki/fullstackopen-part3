const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  Name: {
    type: String,
    minlength: 3,
    required: true
  },
  Number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{7,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})
  

//const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)