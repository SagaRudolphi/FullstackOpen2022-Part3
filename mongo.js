
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url= 
`mongodb+srv://saga:${password}@cluster0.veehg.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person)        
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length === 5 ) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log('person saved!', person)
        mongoose.connection.close()
    })
}
else{
    console.log('you neeed to specify name and number to add a new person')
}


