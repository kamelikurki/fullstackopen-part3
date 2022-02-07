const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

let password = ''
let name = ''
let number = '' 

if(process.argv.length === 3)
{
  password = process.argv[2]
}
else if ( process.argv.length === 5)
{
  password = process.argv[2]
  name = process.argv[3]
  number = process.argv[4]
}



const url =
  `mongodb+srv://fullstack:${password}@cluster0.ryrxg.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  Name: String,
  Number: String
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length === 5)
{
  const person = new Person({
    Name: name,
    Number: number,
  })

  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  }) 
}

if ( process.argv.length === 3)
{
  console.log(`phonebook:`)
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.Name} ${person.Number}`)
    })
    mongoose.connection.close()
  })
}