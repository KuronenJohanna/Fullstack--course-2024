import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'
import personService from './services/notes'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [namesToShow, setNamesToShow] = useState(persons)
  const [noteMessage, setNoteMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(()=> {
    personService
      .getAll()
      .then(initialPersons => {
      
      setPersons(initialPersons)
      setNamesToShow(initialPersons)
    })

  },[])

  const addName = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName,
      number: newNumber
    }
    const spesificName = persons.find(person => person.name === newName)
    
    const updatedName = { ...spesificName, number: newNumber}
      
    spesificName
      ? confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) 
      &&

    personService
       .update(spesificName.id, updatedName)
       .then(response => {
        setPersons(persons.map(person => person.id !== spesificName.id ? person : response.data))
        setNamesToShow(persons.map(person => person.id !== spesificName.id ? person : response.data))
        setNewName('')
        setNewNumber('')
      })
      // eslint-disable-next-line
      .then(note => {
        
        setNoteMessage(`Number of ${newName} was changed`)
        setTimeout(() => {
          setNoteMessage(null)
        }, 5000)
      })
      // eslint-disable-next-line
      .catch(error => {
        setErrorMessage(
          `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        setPersons(persons.filter(n => n.id !== spesificName.id))
        setNamesToShow(persons.filter(n => n.id !== spesificName.id))
      })

      : personService
        .create(newContact)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          setNamesToShow(persons.concat(returnedContact))
          setNewName('')
          setNewNumber('') 
        })
        // eslint-disable-next-line
        .then(note => {
          setNoteMessage(`Added ${newName}`)
          setTimeout(() => {
            setNoteMessage(null)
          }, 5000)
        })
        .catch(error => {
          const errorToJason = Object.values(error.response.data)
          setErrorMessage(errorToJason)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
  }
  const handleDeleteitem = (personId, personName) => {
    confirm(`Delete ${personName} ?`) 
    && personService
      .deleteItem(personId)
      // eslint-disable-next-line
      .then(returnedContact => {
        const remainingPersons = persons.filter(person => person.id !== personId)
        setPersons(remainingPersons)
        setNamesToShow(remainingPersons) 
      })
      // eslint-disable-next-line
      .then(note => {
        setNoteMessage(`Deleted ${personName}`)
        setTimeout(() => {
          setNoteMessage(null)
        }, 5000)
      })
      

  }

  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlefindChange = (event) => {
    
    const writtenValue = event.target.value
    const result = persons.filter(person => person.name.toLowerCase().startsWith(writtenValue.toLowerCase()))
    setNamesToShow(result)
}
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={noteMessage} error={errorMessage}/>
        <Filter persons={persons}
                handlefindChange={handlefindChange}/>
        
        <h3>Add a new</h3>
        <PersonForm addName={addName}
                    newName={newName}
                    handleNameChange={handleNameChange}
                    newNumber={newNumber}
                    handleNumberChange={handleNumberChange}
                    />
      <h2>Numbers</h2>
        <Persons  namesToShow={namesToShow}
                  handleDeleteitem={handleDeleteitem}
        />
      
    </div>
  )

}

export default App