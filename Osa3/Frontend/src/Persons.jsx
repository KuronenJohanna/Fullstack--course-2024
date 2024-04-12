const Persons = ({namesToShow, handleDeleteitem}) => {


    return (
        <div> 
            {namesToShow.map(person => 
            <p key={person.id}>
                {person.name} {person.number}
                <button onClick={() => handleDeleteitem(person.id, person.name)}>delete</button>
            </p>)}
        </div>
    )
}



export default Persons