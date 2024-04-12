const PersonForm = ({addName, newName, newNumber, handleNameChange, handleNumberChange}) => {


    return(
        <form onSubmit={addName} id="phonebook">
        <div>
            name: <input 
            value={newName}
            onChange={handleNameChange}
            id="name"
            />
        </div>
        <div>
            number: <input
            value={newNumber}
            onChange={handleNumberChange}
            id="number"
            />

        </div>
        <div>
            <button type="submit">add</button>
        </div>
        </form>
    )
}
export default PersonForm